import { useCallback, useContext, useMemo } from "react"
import { RouterContext } from "./context"
import type { NavigateOptions, RouteParams, RouterInstance } from "./types"

/**
 * Hook to access the router context
 * Throws if used outside of RouterProvider
 */
function useRouterContext() {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider or FileSystemRouter")
  }
  return context
}

/**
 * Hook to access the full router instance
 */
export function useRouter(): RouterInstance {
  const context = useRouterContext()

  // rerender-dependencies: depend on specific functions, not entire context object
  const { navigate, back, forward, pathname, params } = context

  const push = useCallback(
    (path: string, options?: NavigateOptions) => {
      navigate(path, options)
    },
    [navigate],
  )

  const replace = useCallback(
    (path: string) => {
      navigate(path, { replace: true })
    },
    [navigate],
  )

  return useMemo<RouterInstance>(
    () => ({
      pathname,
      params,
      push,
      replace,
      back,
      forward,
    }),
    [pathname, params, push, replace, back, forward],
  )
}

/**
 * Hook to get route parameters
 */
export function useParams<T extends RouteParams = RouteParams>(): T {
  const context = useRouterContext()
  return context.params as T
}

/**
 * Hook to get current pathname
 */
export function usePathname(): string {
  const context = useRouterContext()
  return context.pathname
}

/**
 * Hook to get navigate function
 */
export function useNavigate() {
  const context = useRouterContext()
  return context.navigate
}
