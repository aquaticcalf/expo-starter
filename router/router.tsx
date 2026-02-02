import { type ComponentType, useContext, useMemo } from "react"
import { StyleSheet, Text, View } from "react-native"
import { RouterContext, RouterProvider } from "./context"
import type {
  FileSystemRouterProps,
  Layout,
  Layouts,
  NotFoundComponent,
  NotFounds,
  Pages,
  Route,
  RouteParams,
} from "./types"
import { buildRoutes, matchRoute, processPagesGlob } from "./utils"

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

  // rerender-derived-state-no-effect: compute params during render, not in effect
  const currentParams: RouteParams = matchResult?.params ?? {}

  // Only update context params when they actually change
  // Use useMemo to detect changes and update synchronously during render
  const paramsKey = JSON.stringify(currentParams)
  useMemo(() => {
    updateParams(currentParams)
  }, [paramsKey, updateParams])

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
 * Provide either pagesDir (simple) OR pages/layouts (advanced)
 */
export function FileSystemRouter(props: FileSystemRouterProps) {
  const { initialPath = "/", notFound } = props

  // Build routes from either pagesDir or pages/layouts
  const { routes, rootNotFound } = useMemo(() => {
    if ("pagesDir" in props) {
      // Simple API: just provide the directory path
      const globPattern = `${props.pagesDir}/**/*.tsx`
      const modules = import.meta.glob<{ default: ComponentType }>(globPattern, { eager: true })
      const { pages, layouts, notFounds } = processPagesGlob(modules)
      return buildRoutes(pages, layouts, notFounds)
    } else {
      // Advanced API: provide pre-loaded pages, layouts, and optional notFounds
      return buildRoutes(
        props.pages,
        props.layouts ?? {},
        (props as { notFounds?: NotFounds }).notFounds ?? {},
      )
    }
  }, [props])

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
