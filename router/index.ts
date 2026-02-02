// Main components
export { FileSystemRouter, generateRoutes } from "./router"
export { Link } from "./link"
export { RouterProvider } from "./context"

// Navigation components
export { Tabs } from "./tabs"
export type { TabsProps, TabItem } from "./tabs"
export { Stack } from "./stack"
export type { StackProps, StackScreenOptions, StackScreenProps } from "./stack"

// Hooks
export { useRouter, useParams, usePathname, useNavigate } from "./hooks"

// Utilities
export {
  convertFilePathToRoutePath,
  createRoutePattern,
  buildRoutes,
  matchRoute,
  normalizePath,
  isLayoutFile,
  is404Page,
  isRouteGroup,
  getGroupName,
  processPagesGlob,
} from "./utils"

// Types
export type {
  PageModule,
  Pages,
  Layout,
  LayoutProps,
  LayoutModule,
  Layouts,
  NotFoundComponent,
  NotFoundModule,
  NotFounds,
  RouteParams,
  Route,
  NavigateOptions,
  RouterInstance,
  RouterContextValue,
  RouterProviderProps,
  FileSystemRouterProps,
  LinkProps,
} from "./types"
