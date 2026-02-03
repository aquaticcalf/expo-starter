import { useCallback, useContext, useMemo } from "react"
import { RouterContext } from "./context"
import type { NavigateOptions, RouteParams, RouterInstance } from "./types"

/**
 * Access the router context.
 * Throws if used outside of RouterProvider to catch misuse early.
 */
function useRouterContext() {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider or FileSystemRouter.")
  }
  return context
}

/**
 * Access the full router instance with navigation methods.
 * Returns a stable object reference when underlying values haven't changed.
 */
export function useRouter(): RouterInstance {
  const context = useRouterContext()

  // Destructure to depend on specific values, not the entire context object.
  // This prevents re-renders when unrelated context values change.
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

  // Memoize the router instance to maintain referential equality.
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
 * Get route parameters extracted from the current path.
 * Generic parameter allows type-safe access to expected params.
 */
export function useParams<T extends RouteParams = RouteParams>(): T {
  const context = useRouterContext()
  return context.params as T
}

/**
 * Get the current pathname.
 * Returns the normalized path without query string.
 */
export function usePathname(): string {
  const context = useRouterContext()
  return context.pathname
}

/**
 * Get the navigate function directly.
 * Useful when you only need navigation without other router state.
 */
export function useNavigate() {
  const context = useRouterContext()
  return context.navigate
}
