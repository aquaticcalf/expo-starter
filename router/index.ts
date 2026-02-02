// Main components
export { FileSystemRouter, generateRoutes } from "./router"
export { Link } from "./link"
export { RouterProvider } from "./context"

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
  RouteParams,
  Route,
  NavigateOptions,
  RouterInstance,
  RouterContextValue,
  RouterProviderProps,
  FileSystemRouterProps,
  LinkProps,
} from "./types"
