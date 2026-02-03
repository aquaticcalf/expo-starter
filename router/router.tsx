import { type ComponentType, useContext, useEffect, useMemo, useRef } from "react"
import { StyleSheet, Text, View } from "react-native"
import { RouterContext, RouterProvider } from "./context"
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

// rendering-hoist-jsx: extract static styles outside component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
})

/**
 * Import all page modules using require.context
 */
const pagesContext = require.context("../pages", true, /\.tsx$/)

/**
 * Process the context modules into pages, layouts, and 404s
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
    // require.context returns keys like "./index.tsx", "./(tabs)/+layout.tsx"
    // Convert to full path format: "./pages/index.tsx"
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

// Pre-processed page modules - evaluated once at module load
const { pages, layouts, notFounds } = processContextImports()

/**
 * Default 404 component
 */
function DefaultNotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>Page not found</Text>
    </View>
  )
}

/**
 * Find the most specific 404 component for a pathname
 * E.g., /users/123/not-exist → look for ./pages/users/404, then ./pages/404
 */
function findNotFoundForPath(
  pathname: string,
  routes: Route[],
  rootNotFound: NotFoundComponent | null,
): NotFoundComponent {
  // First check if any route matches the parent path and has its own 404
  const pathParts = pathname.split("/").filter(Boolean)

  for (let i = pathParts.length; i >= 0; i--) {
    const testPath = "/" + pathParts.slice(0, i).join("/")
    const match = matchRoute(testPath, routes)
    if (match && match.route.notFound) {
      return match.route.notFound
    }
  }

  // Fall back to root 404 or default
  return rootNotFound ?? DefaultNotFound
}

/**
 * Component that wraps children with all layouts in order
 * Outer layouts wrap inner layouts
 */
function LayoutWrapper({ layouts, children }: { layouts: Layout[]; children: React.ReactNode }) {
  // Apply layouts from outermost to innermost
  return layouts.reduce((wrapped, LayoutComponent) => {
    return <LayoutComponent>{wrapped}</LayoutComponent>
  }, children)
}

/**
 * Internal component that renders the matched route
 */
function RouteRenderer({
  routes,
  rootNotFound,
}: {
  routes: Route[]
  rootNotFound: NotFoundComponent | null
}) {
  const context = useContext(RouterContext)

  if (!context) {
    throw new Error("RouteRenderer must be used within RouterProvider")
  }

  const { pathname, updateParams } = context

  // rerender-derived-state-no-effect: derive match result during render
  const matchResult = useMemo(() => matchRoute(pathname, routes), [pathname, routes])

  // Update params when route changes (useEffect to avoid setState during render)
  const prevMatchRef = useRef(matchResult)
  const prevParamsRef = useRef<RouteParams>({})
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
    // No route matched - find most specific 404 for this path
    const NotFoundComponent = findNotFoundForPath(pathname, routes, rootNotFound)
    return <NotFoundComponent />
  }

  const { route } = matchResult
  const Component = route.component

  // Wrap component with layouts if any exist
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
 * File system router component
 * Automatically discovers and routes pages from the pages directory
 */
export function FileSystemRouter(props: FileSystemRouterProps) {
  const { initialPath = "/", notFound } = props

  // Extract explicit props for stable memoization - avoid depending on entire props object
  const explicitPages = "pages" in props ? props.pages : undefined
  const explicitLayouts = "pages" in props ? props.layouts : undefined
  const explicitNotFounds =
    "pages" in props ? (props as { notFounds?: NotFounds }).notFounds : undefined

  // Build routes from the pre-imported modules
  const { routes, rootNotFound } = useMemo(() => {
    if (explicitPages) {
      // Advanced API: provide pre-loaded pages, layouts, and optional notFounds
      return buildRoutes(explicitPages, explicitLayouts ?? {}, explicitNotFounds ?? {})
    } else {
      // Simple API: use the context-imported modules
      return buildRoutes(pages, layouts, notFounds)
    }
  }, [explicitPages, explicitLayouts, explicitNotFounds])

  // Allow override via prop, otherwise use root 404 from pages/404.tsx, or default
  const finalRootNotFound = notFound ?? rootNotFound ?? DefaultNotFound

  return (
    <RouterProvider initialPath={initialPath}>
      <RouteRenderer routes={routes} rootNotFound={finalRootNotFound} />
    </RouterProvider>
  )
}

/**
 * Generate routes from pages object (for advanced use cases)
 */
export function generateRoutes(pages: Pages, layouts: Layouts = {}, notFounds: NotFounds = {}) {
  return buildRoutes(pages, layouts, notFounds)
}
