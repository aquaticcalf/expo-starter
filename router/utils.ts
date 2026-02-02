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

/**
 * Check if a segment is a route group (parentheses wrapped like "(tabs)")
 * Route groups are used for layout organization but don't appear in the URL
 */
export function isRouteGroup(segment: string): boolean {
  return segment.startsWith("(") && segment.endsWith(")")
}

/**
 * Extract the group name from a route group segment
 * "(tabs)" -> "tabs"
 */
export function getGroupName(segment: string): string {
  return segment.slice(1, -1)
}

/**
 * Convert a file path like "./pages/users/[id].tsx" to route path "/users/:id"
 * Route groups like "(tabs)" are excluded from the URL path
 */
export function convertFilePathToRoutePath(key: string): string {
  const match = key.match(/pages\/(.*)\.(jsx|tsx)$/)

  if (!match) {
    throw new Error(`Invalid page path: ${key}`)
  }

  const pathWithoutPages = match[1]
  const segments = pathWithoutPages.split("/")

  const routeSegments = segments
    .filter((segment) => !isRouteGroup(segment)) // Filter out route groups
    .map((segment) => {
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
 * Extract directory path from a file path
 * "./pages/users/[id].tsx" → "./pages/users"
 * "./pages/index.tsx" → "./pages"
 */
function getDirectoryPath(key: string): string {
  const lastSlashIndex = key.lastIndexOf("/")
  return lastSlashIndex > 0 ? key.slice(0, lastSlashIndex) : "."
}

/**
 * Check if a path is a layout file
 */
export function isLayoutFile(key: string): boolean {
  return /pages\/.*\+layout\.(jsx|tsx)$/.test(key)
}

/**
 * Get the directory a layout applies to
 * "./pages/+layout.tsx" → "./pages"
 * "./pages/users/+layout.tsx" → "./pages/users"
 */
function getLayoutDirectory(key: string): string {
  return key.replace(/\/\+layout\.(jsx|tsx)$/, "")
}

/**
 * Check if a file is a 404 page (at any level)
 * "./pages/404.tsx" → true (root 404)
 * "./pages/users/404.tsx" → true (nested 404)
 */
export function is404Page(key: string): boolean {
  return /pages\/.*404\.(jsx|tsx)$/.test(key)
}

/**
 * Get the directory a 404 page applies to
 * "./pages/404.tsx" → "./pages" (applies to all routes)
 * "./pages/users/404.tsx" → "./pages/users" (applies to /users/*)
 */
function get404Directory(key: string): string {
  return key.replace(/\/404\.(jsx|tsx)$/, "")
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
 * Build routes from pages object with layouts and nested 404s
 */
export function buildRoutes(
  pages: Pages,
  layouts: Layouts,
  notFounds: NotFounds,
): { routes: Route[]; rootNotFound: NotFoundComponent | null } {
  let rootNotFound: NotFoundComponent | null = null
  const routes: Route[] = []

  // Build layout hierarchy: directory -> layout component
  const layoutMap = new Map<string, Layout>()
  for (const [key, module] of Object.entries(layouts)) {
    const dir = getLayoutDirectory(key)
    layoutMap.set(dir, module.default)
  }

  // Build 404 hierarchy: directory -> 404 component (more specific = deeper)
  const notFoundMap = new Map<string, NotFoundComponent>()
  for (const [key, module] of Object.entries(notFounds)) {
    const dir = get404Directory(key)
    notFoundMap.set(dir, module.default)
    // Track root 404 separately
    if (dir === "./pages") {
      rootNotFound = module.default
    }
  }

  // Build routes
  for (const [key, module] of Object.entries(pages)) {
    const path = convertFilePathToRoutePath(key)
    const { pattern, paramNames } = createRoutePattern(path)

    // Collect layouts for this route (from root to leaf)
    const routeLayouts: Layout[] = []
    const pageDir = getDirectoryPath(key)

    // Build path from root to page directory, collecting layouts
    const parts = pageDir.replace(/^\.\//, "").split("/")
    let currentPath = "./pages"

    // Always check root layout first
    if (layoutMap.has(currentPath)) {
      routeLayouts.push(layoutMap.get(currentPath)!)
    }

    // Then check nested layouts
    for (let i = 1; i < parts.length; i++) {
      currentPath += `/${parts[i]}`
      if (layoutMap.has(currentPath)) {
        routeLayouts.push(layoutMap.get(currentPath)!)
      }
    }

    // Find the most specific 404 for this route
    let routeNotFound: NotFoundComponent | null = null
    currentPath = "./pages"

    // Check from root to page directory for most specific 404
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

  // Sort routes: static routes first, then dynamic routes, then catch-all
  routes.sort((a, b) => {
    const aHasParams = a.paramNames.length > 0
    const bHasParams = b.paramNames.length > 0

    if (aHasParams && !bHasParams) return 1
    if (!aHasParams && bHasParams) return -1

    // More specific paths (more segments) should come first
    return b.path.split("/").length - a.path.split("/").length
  })

  return { routes, rootNotFound }
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

/**
 * Process glob results to separate pages, layouts, and 404s
 * Call this with: import.meta.glob with pattern for all tsx files in pages dir
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
