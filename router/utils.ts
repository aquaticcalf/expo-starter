import type { ComponentType } from "react"
import type {
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

// Maximum route depth to prevent infinite loops in malformed route structures.
const MAX_ROUTE_DEPTH = 20

/**
 * Check if a segment is a route group (parentheses wrapped like "(tabs)").
 * Route groups organize layouts without affecting the URL structure.
 */
export function isRouteGroup(segment: string): boolean {
  return segment.startsWith("(") && segment.endsWith(")")
}

/**
 * Extract the group name from a route group segment.
 * "(tabs)" -> "tabs"
 */
export function getGroupName(segment: string): string {
  return segment.slice(1, -1)
}

/**
 * Convert a file path to a route path.
 * "./pages/users/[id].tsx" -> "/users/:id"
 *
 * Route groups like "(tabs)" are excluded from the URL path because they
 * exist only for layout organization, not navigation semantics.
 */
export function convertFilePathToRoutePath(key: string): string {
  const match = key.match(/^\.?\/pages\/(.*)\.(jsx|tsx)$/)

  if (!match) {
    throw new Error(`Invalid page path: ${key}. Expected format: pages/*.tsx`)
  }

  const pathWithoutPages = match[1]
  const segments = pathWithoutPages.split("/")

  // Guard against excessively deep routes which may indicate a bug.
  if (segments.length > MAX_ROUTE_DEPTH) {
    throw new Error(`Route depth exceeds maximum of ${MAX_ROUTE_DEPTH}: ${key}`)
  }

  const routeSegments = segments
    .filter((segment) => !isRouteGroup(segment))
    .map((segment) => {
      if (segment === "index") return ""
      // Convert [param] syntax to :param for URL matching.
      if (segment.startsWith("[") && segment.endsWith("]")) {
        return `:${segment.slice(1, -1)}`
      }
      return segment
    })

  // Remove trailing empty segments (from index files).
  const filteredSegments = [...routeSegments]
  while (filteredSegments.length > 0 && filteredSegments[filteredSegments.length - 1] === "") {
    filteredSegments.pop()
  }

  const routePath = filteredSegments.join("/")
  return routePath === "" ? "/" : `/${routePath}`
}

/**
 * Extract directory path from a file path.
 * "./pages/users/[id].tsx" -> "./pages/users"
 */
function getDirectoryPath(key: string): string {
  const lastSlashIndex = key.lastIndexOf("/")
  return lastSlashIndex > 0 ? key.slice(0, lastSlashIndex) : "."
}

/**
 * Check if a path is a layout file.
 * Layout files use the +layout convention to wrap child routes.
 */
export function isLayoutFile(key: string): boolean {
  return /pages\/.*\+layout\.(jsx|tsx)$/.test(key)
}

/**
 * Get the directory a layout applies to.
 * "./pages/+layout.tsx" -> "./pages"
 */
function getLayoutDirectory(key: string): string {
  return key.replace(/\/\+layout\.(jsx|tsx)$/, "")
}

/**
 * Check if a file is a 404 page (at any level).
 * 404 pages handle unmatched routes within their directory scope.
 */
export function is404Page(key: string): boolean {
  return /pages\/.*404\.(jsx|tsx)$/.test(key)
}

/**
 * Get the directory a 404 page applies to.
 * More specific 404s (deeper in hierarchy) take precedence.
 */
function get404Directory(key: string): string {
  return key.replace(/\/404\.(jsx|tsx)$/, "")
}

/**
 * Convert a route path like "/users/:id" to a regex pattern.
 * Returns both the pattern and extracted parameter names for matching.
 */
export function createRoutePattern(routePath: string): { pattern: RegExp; paramNames: string[] } {
  const paramNames: string[] = []

  const regexPattern = routePath
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) {
        paramNames.push(segment.slice(1))
        // Match any characters except forward slash.
        return "([^/]+)"
      }
      // Escape regex special characters in literal segments.
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    })
    .join("/")

  // Anchor pattern to match entire path, not partial matches.
  const pattern = new RegExp(`^${regexPattern}$`)
  return { pattern, paramNames }
}

/**
 * Build routes from pages object with layouts and nested 404s.
 * Routes are sorted by specificity: static routes first, then dynamic, then catch-all.
 */
export function buildRoutes(
  pages: Pages,
  layouts: Layouts,
  notFounds: NotFounds,
): { routes: Route[]; rootNotFound: NotFoundComponent | null } {
  let rootNotFound: NotFoundComponent | null = null
  const routes: Route[] = []

  // Build layout hierarchy: directory -> layout component.
  const layoutMap = new Map<string, Layout>()
  for (const [key, module] of Object.entries(layouts)) {
    const dir = getLayoutDirectory(key)
    layoutMap.set(dir, module.default)
  }

  // Build 404 hierarchy: directory -> 404 component.
  // More specific directories take precedence over parents.
  const notFoundMap = new Map<string, NotFoundComponent>()
  for (const [key, module] of Object.entries(notFounds)) {
    const dir = get404Directory(key)
    notFoundMap.set(dir, module.default)
    if (dir === "./pages") {
      rootNotFound = module.default
    }
  }

  // Build routes from page modules.
  for (const [key, module] of Object.entries(pages)) {
    const path = convertFilePathToRoutePath(key)
    const { pattern, paramNames } = createRoutePattern(path)

    // Collect layouts from root to leaf for proper nesting.
    const routeLayouts: Layout[] = []
    const pageDir = getDirectoryPath(key)

    const parts = pageDir.replace(/^\.\//, "").split("/")
    let currentPath = "./pages"

    // Check root layout first.
    if (layoutMap.has(currentPath)) {
      routeLayouts.push(layoutMap.get(currentPath)!)
    }

    // Walk directory tree collecting nested layouts.
    for (let i = 1; i < parts.length; i++) {
      currentPath += `/${parts[i]}`
      if (layoutMap.has(currentPath)) {
        routeLayouts.push(layoutMap.get(currentPath)!)
      }
    }

    // Find most specific 404 for this route.
    let routeNotFound: NotFoundComponent | null = null
    currentPath = "./pages"

    if (notFoundMap.has(currentPath)) {
      routeNotFound = notFoundMap.get(currentPath)!
    }

    for (let i = 1; i < parts.length; i++) {
      currentPath += `/${parts[i]}`
      if (notFoundMap.has(currentPath)) {
        routeNotFound = notFoundMap.get(currentPath)!
      }
    }

    routes.push({
      path,
      pattern,
      paramNames,
      component: module.default,
      layouts: routeLayouts,
      notFound: routeNotFound,
    })
  }

  // Sort routes by specificity for correct matching order.
  // Static routes match before dynamic routes to prevent over-matching.
  routes.sort((a, b) => {
    const aHasParams = a.paramNames.length > 0
    const bHasParams = b.paramNames.length > 0

    // Static routes come first.
    if (aHasParams && !bHasParams) return 1
    if (!aHasParams && bHasParams) return -1

    // More specific paths (more segments) come first.
    return b.path.split("/").length - a.path.split("/").length
  })

  return { routes, rootNotFound }
}

/**
 * Match a pathname against routes and extract params.
 * Returns the first matching route or null if no match found.
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
 * Normalize pathname to ensure consistent format.
 * Ensures leading slash, removes trailing slash (except for root).
 */
export function normalizePath(path: string): string {
  // Ensure leading slash.
  let normalized = path.startsWith("/") ? path : `/${path}`
  // Remove trailing slash except for root path.
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1)
  }
  return normalized
}

/**
 * Process module imports to separate pages, layouts, and 404s.
 * This categorizes require.context results for the file-system router.
 */
export function processPagesGlob(modules: Record<string, { default: ComponentType }>): {
  pages: Pages
  layouts: Layouts
  notFounds: NotFounds
} {
  const pages: Pages = {}
  const layouts: Layouts = {}
  const notFounds: NotFounds = {}

  for (const [key, module] of Object.entries(modules)) {
    if (isLayoutFile(key)) {
      layouts[key] = module as LayoutModule
    } else if (is404Page(key)) {
      notFounds[key] = module as NotFoundModule
    } else {
      pages[key] = module as PageModule
    }
  }

  return { pages, layouts, notFounds }
}
