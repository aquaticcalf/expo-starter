import type { ComponentType, ReactNode } from "react"

/**
 * Props for layout components
 */
export interface LayoutProps {
  children: ReactNode
}

/**
 * A layout component that wraps pages
 */
export type Layout = ComponentType<LayoutProps>

/**
 * A page module with default export
 */
export interface PageModule {
  default: ComponentType
}

/**
 * A layout module with default export
 */
export interface LayoutModule {
  default: Layout
}

/**
 * A 404/not-found component
 */
export type NotFoundComponent = ComponentType

/**
 * A 404 module with default export
 */
export interface NotFoundModule {
  default: NotFoundComponent
}

/**
 * Record of file paths to page modules
 * Key format: "./pages/[path].(tsx|jsx)"
 */
export type Pages = Record<string, PageModule>

/**
 * Record of file paths to layout modules
 * Key format: "./pages/[path]/+layout.(tsx|jsx)"
 */
export type Layouts = Record<string, LayoutModule>

/**
 * Record of file paths to 404 modules
 * Key format: "./pages/404.(tsx|jsx)" or "./pages/[path]/404.(tsx|jsx)"
 */
export type NotFounds = Record<string, NotFoundModule>

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
  layouts: Layout[]
  notFound: NotFoundComponent | null
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
  previousPathname: string | null
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
 * Auto-discovers pages or accepts explicit pages/layouts/notFounds
 */
export type FileSystemRouterProps =
  | {
      initialPath?: string
      notFound?: ComponentType
    }
  | {
      pages: Pages
      layouts?: Layouts
      notFounds?: NotFounds
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
