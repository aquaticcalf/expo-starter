import { type ComponentType, useContext, useEffect, useMemo, useRef } from "react"
import { RouterContext, RouterProvider, currentRouteKeyRef } from "./context"
import { Flex, Text, Button } from "@/components"
import { useNavigate } from "./hooks"
import type {
  FileSystemRouterProps,
  Layout,
  LayoutModule,
  Layouts,
  NotFoundComponent,
  NotFoundModule,
  NotFounds,
  PageModule,
  Pages,
  Route,
  RouteParams,
} from "./types"
import { buildRoutes, is404Page, isLayoutFile, matchRoute } from "./utils"

/**
 * Import all page modules using require.context.
 * This enables automatic route discovery at build time.
 */
const pagesContext = require.context("../pages", true, /\.tsx$/)

/**
 * Process the context modules into pages, layouts, and 404s.
 * Separates different file types for the route builder.
 */
function processContextImports(): {
  pages: Pages
  layouts: Layouts
  notFounds: NotFounds
} {
  const pages: Pages = {}
  const layouts: Layouts = {}
  const notFounds: NotFounds = {}

  pagesContext.keys().forEach((key) => {
    // Convert require.context key format to full path format.
    // "./index.tsx" -> "./pages/index.tsx"
    const fullKey = `./pages${key.slice(1)}`
    const module = pagesContext(key) as { default: ComponentType }

    if (isLayoutFile(fullKey)) {
      layouts[fullKey] = module as LayoutModule
    } else if (is404Page(fullKey)) {
      notFounds[fullKey] = module as NotFoundModule
    } else {
      pages[fullKey] = module as PageModule
    }
  })

  return { pages, layouts, notFounds }
}

// Pre-process page modules at module load time for faster startup.
const { pages, layouts, notFounds } = processContextImports()

/**
 * Default 404 component shown when no route matches.
 * Used as fallback when no custom 404 is defined.
 */
function DefaultNotFound() {
  const navigate = useNavigate()

  return (
    <Flex grow={1} align="center" justify="center" gap={20}>
      <Flex align="center" gap={2}>
        <Text variant="headline" color="default">
          404
        </Text>
        <Text variant="body" color="muted">
          Page not found
        </Text>
      </Flex>
      <Button onPress={() => navigate("/")}>Go Home</Button>
    </Flex>
  )
}

/**
 * Collect layouts from root to the given directory path.
 */
function collectLayoutsForPath(targetPath: string, layoutMap: Map<string, Layout>): Layout[] {
  const layouts: Layout[] = []
  const pathParts = targetPath.split("/").filter(Boolean)

  let currentPath = "./pages"
  if (layoutMap.has(currentPath)) {
    layouts.push(layoutMap.get(currentPath)!)
  }

  for (let i = 0; i < pathParts.length; i++) {
    currentPath += `/${pathParts[i]}`
    if (layoutMap.has(currentPath)) {
      layouts.push(layoutMap.get(currentPath)!)
    }
  }

  return layouts
}

/**
 * Find the most specific 404 component for a pathname.
 * If no specific 404 exists for the pathname, use the referrer's section 404.
 */
function findNotFoundForPath(
  pathname: string,
  referrer: string | null,
  previousRouteKey: string | null,
  notFounds: NotFounds,
  layoutMap: Map<string, Layout>,
  parentNotFound?: NotFoundComponent,
): { notFound: NotFoundComponent; layouts: Layout[] } {
  const notFoundMap = new Map<string, NotFoundComponent>()
  for (const [key, module] of Object.entries(notFounds)) {
    const dir = key.replace(/\/404\.(jsx|tsx)$/, "")
    notFoundMap.set(dir, module.default)
  }

  // First, try to find the most specific 404 for the pathname.
  const pathParts = pathname.split("/").filter(Boolean)
  let currentPath = "./pages"
  let specific404: NotFoundComponent | null = null

  if (notFoundMap.has(currentPath)) {
    specific404 = notFoundMap.get(currentPath)!
  }

  for (let i = 0; i < pathParts.length; i++) {
    currentPath += `/${pathParts[i]}`
    if (notFoundMap.has(currentPath)) {
      specific404 = notFoundMap.get(currentPath)!
    }
  }

  // If specific 404 found, use it with its layouts.
  if (specific404) {
    const layouts = collectLayoutsForPath(currentPath.replace(/^\.\/pages/, ""), layoutMap)
    return { notFound: specific404, layouts }
  }

  // Try to find referrer's 404 using the previous route key (e.g., ./pages/(tabs)/index.tsx)
  if (previousRouteKey) {
    const referrerDir = previousRouteKey.replace(/\/[^/]+\.(tsx|jsx)$/, "")
    if (notFoundMap.has(referrerDir)) {
      const layouts = collectLayoutsForPath(referrerDir.replace(/^\.\/pages/, ""), layoutMap)
      return { notFound: notFoundMap.get(referrerDir)!, layouts }
    }
  }

  // Fall back to parent-level notFound or default.
  const layouts = collectLayoutsForPath("", layoutMap)
  return { notFound: parentNotFound ?? DefaultNotFound, layouts }
}

/**
 * Wrap children with all layouts in order (outer to inner).
 * Uses reduce to nest layout components properly.
 */
function LayoutWrapper({ layouts, children }: { layouts: Layout[]; children: React.ReactNode }) {
  return layouts.reduce((wrapped, LayoutComponent) => {
    return <LayoutComponent>{wrapped}</LayoutComponent>
  }, children)
}

/**
 * Internal component that renders the matched route.
 * Handles route matching, param extraction, and layout application.
 */
function RouteRenderer({
  routes,
  notFounds,
  layoutMap,
  parentNotFound,
}: {
  routes: Route[]
  notFounds: NotFounds
  layoutMap: Map<string, Layout>
  parentNotFound?: NotFoundComponent
}) {
  const context = useContext(RouterContext)

  if (!context) {
    throw new Error("RouteRenderer must be used within RouterProvider.")
  }

  const { pathname, previousPathname, previousRouteKey, updateParams } = context

  // Derive match result during render to avoid effect timing issues.
  const matchResult = useMemo(() => matchRoute(pathname, routes), [pathname, routes])

  // Track previous match to detect route changes.
  const prevMatchRef = useRef(matchResult)
  const prevParamsRef = useRef<RouteParams>({})

  // Set current route key synchronously so it's available before navigation
  if (matchResult?.route && currentRouteKeyRef.current !== matchResult.route.fileKey) {
    currentRouteKeyRef.current = matchResult.route.fileKey
  }

  // Update params when route changes.
  // Uses useEffect to avoid setState during render.
  useEffect(() => {
    const currentParams = matchResult?.params ?? {}
    const prevParams = prevParamsRef.current
    const paramsChanged =
      Object.keys(currentParams).length !== Object.keys(prevParams).length ||
      Object.entries(currentParams).some(([key, val]) => prevParams[key] !== val)

    if (paramsChanged || prevMatchRef.current?.route !== matchResult?.route) {
      prevParamsRef.current = currentParams
      prevMatchRef.current = matchResult
      updateParams(currentParams)
    }
  }, [matchResult, updateParams])

  if (!matchResult) {
    // No route matched - find most specific 404 and its layouts for this path.
    const { notFound: NotFoundComponent, layouts } = findNotFoundForPath(
      pathname,
      previousPathname,
      previousRouteKey,
      notFounds,
      layoutMap,
      parentNotFound,
    )
    if (layouts.length > 0) {
      return (
        <LayoutWrapper layouts={layouts}>
          <NotFoundComponent />
        </LayoutWrapper>
      )
    }
    return <NotFoundComponent />
  }

  const { route } = matchResult
  const Component = route.component

  // Wrap component with layouts if any exist.
  if (route.layouts.length > 0) {
    return (
      <LayoutWrapper layouts={route.layouts}>
        <Component />
      </LayoutWrapper>
    )
  }

  return <Component />
}

/**
 * File system router component.
 * Automatically discovers and routes pages from the pages directory.
 */
export function FileSystemRouter(props: FileSystemRouterProps) {
  const { initialPath = "/", notFound } = props

  // Extract explicit props for stable memoization.
  // Avoids depending on entire props object which may change reference.
  const explicitPages = "pages" in props ? props.pages : undefined
  const explicitLayouts = "pages" in props ? props.layouts : undefined
  const explicitNotFounds =
    "pages" in props ? (props as { notFounds?: NotFounds }).notFounds : undefined

  // Build routes from the pre-imported modules.
  const { routes } = useMemo(() => {
    if (explicitPages) {
      // Advanced API: use provided pages, layouts, and optional notFounds.
      return buildRoutes(explicitPages, explicitLayouts ?? {}, explicitNotFounds ?? {})
    } else {
      // Simple API: use context-imported modules.
      return buildRoutes(pages, layouts, notFounds)
    }
  }, [explicitPages, explicitLayouts, explicitNotFounds])

  // Build layout map for 404 layout lookup.
  const layoutMap = useMemo(() => {
    const map = new Map<string, Layout>()
    for (const [key, module] of Object.entries(explicitLayouts ?? layouts)) {
      const dir = key.replace(/\/\+layout\.(jsx|tsx)$/, "")
      map.set(dir, module.default)
    }
    return map
  }, [explicitLayouts, layouts])

  const finalNotFounds = explicitNotFounds ?? notFounds

  return (
    <RouterProvider initialPath={initialPath}>
      <RouteRenderer
        routes={routes}
        notFounds={finalNotFounds}
        layoutMap={layoutMap}
        parentNotFound={notFound}
      />
    </RouterProvider>
  )
}

/**
 * Generate routes from pages object (for advanced use cases).
 * Allows manual route configuration when automatic discovery isn't suitable.
 */
export function generateRoutes(pages: Pages, layouts: Layouts = {}, notFounds: NotFounds = {}) {
  return buildRoutes(pages, layouts, notFounds)
}
