import type { Pages, Route, RouteParams } from "./types"

/**
 * Convert a file path like "./pages/users/[id].tsx" to route path "/users/:id"
 */
export function convertFilePathToRoutePath(key: string): string {
  const match = key.match(/pages\/(.*)\.(?:jsx|tsx)$/)

  if (!match) {
    throw new Error(`Invalid page path: ${key}`)
  }

  const pathWithoutPages = match[1]
  const segments = pathWithoutPages.split("/")

  const routeSegments = segments.map((segment) => {
    if (segment === "index") return ""
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return `:${segment.slice(1, -1)}`
    }
    return segment
  })

  const filteredSegments = [...routeSegments]
  while (filteredSegments.length > 0 && filteredSegments[filteredSegments.length - 1] === "") {
    filteredSegments.pop()
  }

  const routePath = filteredSegments.join("/")
  return routePath === "" ? "/" : `/${routePath}`
}

/**
 * Convert a route path like "/users/:id" to a regex pattern
 */
export function createRoutePattern(routePath: string): { pattern: RegExp; paramNames: string[] } {
  const paramNames: string[] = []

  const regexPattern = routePath
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) {
        paramNames.push(segment.slice(1))
        return "([^/]+)"
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    })
    .join("/")

  const pattern = new RegExp(`^${regexPattern}$`)
  return { pattern, paramNames }
}

/**
 * Check if a 404 page exists in the pages object
 */
export function is404Page(key: string): boolean {
  return key === "./pages/404.jsx" || key === "./pages/404.tsx"
}

/**
 * Build routes from pages object
 */
export function buildRoutes(pages: Pages): {
  routes: Route[]
  notFoundComponent: Route["component"] | null
} {
  let notFoundComponent: Route["component"] | null = null
  const routes: Route[] = []

  for (const [key, module] of Object.entries(pages)) {
    if (is404Page(key)) {
      notFoundComponent = module.default
      continue
    }

    const path = convertFilePathToRoutePath(key)
    const { pattern, paramNames } = createRoutePattern(path)

    routes.push({
      path,
      pattern,
      paramNames,
      component: module.default,
    })
  }

  // Sort routes: static routes first, then dynamic routes, then catch-all
  routes.sort((a, b) => {
    const aHasParams = a.paramNames.length > 0
    const bHasParams = b.paramNames.length > 0

    if (aHasParams && !bHasParams) return 1
    if (!aHasParams && bHasParams) return -1

    // More specific paths (more segments) should come first
    return b.path.split("/").length - a.path.split("/").length
  })

  return { routes, notFoundComponent }
}

/**
 * Match a pathname against routes and extract params
 */
export function matchRoute(
  pathname: string,
  routes: Route[],
): { route: Route; params: RouteParams } | null {
  for (const route of routes) {
    const match = pathname.match(route.pattern)

    if (match) {
      const params: RouteParams = {}
      route.paramNames.forEach((name, index) => {
        params[name] = match[index + 1]
      })
      return { route, params }
    }
  }

  return null
}

/**
 * Normalize pathname (ensure leading slash, no trailing slash except for root)
 */
export function normalizePath(path: string): string {
  let normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1)
  }
  return normalized
}
