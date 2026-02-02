import { useContext, useMemo } from "react"
import { StyleSheet, Text, View } from "react-native"
import { RouterContext, RouterProvider } from "./context"
import type { FileSystemRouterProps, Layout, Layouts, Pages, Route, RouteParams } from "./types"
import { buildRoutes, matchRoute } from "./utils"

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
  notFoundComponent: NotFound,
}: {
  routes: Route[]
  notFoundComponent: React.ComponentType
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
    return <NotFound />
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
 * Takes a pages object (from import.meta.glob) and renders matching routes
 */
export function FileSystemRouter({
  pages,
  layouts = {},
  initialPath = "/",
  notFound,
}: FileSystemRouterProps & { layouts?: Layouts }) {
  const { routes, notFoundComponent } = useMemo(() => buildRoutes(pages, layouts), [pages, layouts])

  const NotFoundComponent = notFound ?? notFoundComponent ?? DefaultNotFound

  return (
    <RouterProvider initialPath={initialPath}>
      <RouteRenderer routes={routes} notFoundComponent={NotFoundComponent} />
    </RouterProvider>
  )
}

/**
 * Generate routes from pages object (for advanced use cases)
 */
export function generateRoutes(pages: Pages, layouts: Layouts = {}) {
  return buildRoutes(pages, layouts)
}
