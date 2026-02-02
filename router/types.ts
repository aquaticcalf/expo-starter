import type { ComponentType, ReactNode } from "react"

/**
 * A page module imported via import.meta.glob or require.context
 */
export interface PageModule {
  default: ComponentType
}

/**
 * Record of file paths to page modules
 * Key format: "./pages/[path].(tsx|jsx)"
 */
export type Pages = Record<string, PageModule>

/**
 * Route parameters extracted from dynamic segments like [id]
 */
export type RouteParams = Record<string, string>

/**
 * Internal route definition
 */
export interface Route {
  path: string
  pattern: RegExp
  paramNames: string[]
  component: ComponentType
}

/**
 * Navigation options
 */
export interface NavigateOptions {
  replace?: boolean
}

/**
 * Router instance returned by useRouter hook
 */
export interface RouterInstance {
  pathname: string
  params: RouteParams
  push: (path: string, options?: NavigateOptions) => void
  replace: (path: string) => void
  back: () => void
  forward: () => void
}

/**
 * Router context value
 */
export interface RouterContextValue {
  pathname: string
  params: RouteParams
  navigate: (path: string, options?: NavigateOptions) => void
  back: () => void
  forward: () => void
  updateParams: (params: RouteParams) => void
}

/**
 * Router provider props
 */
export interface RouterProviderProps {
  children: ReactNode
  initialPath?: string
}

/**
 * FileSystemRouter component props
 */
export interface FileSystemRouterProps {
  pages: Pages
  initialPath?: string
  notFound?: ComponentType
}

/**
 * Link component props
 */
export interface LinkProps {
  href: string
  replace?: boolean
  children: ReactNode
  onPress?: () => void
}
