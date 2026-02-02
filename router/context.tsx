import { createContext, useCallback, useMemo, useRef, useState } from "react"
import type { RouterContextValue, RouterProviderProps, RouteParams } from "./types"
import { normalizePath } from "./utils"

export const RouterContext = createContext<RouterContextValue | null>(null)

export function RouterProvider({ children, initialPath = "/" }: RouterProviderProps) {
  // rerender-lazy-state-init: use function for expensive initial values
  const [pathname, setPathname] = useState(() => normalizePath(initialPath))
  const [params, setParams] = useState<RouteParams>({})

  // rerender-use-ref-transient-values: use refs for values accessed in callbacks
  // This avoids stale closures and keeps callbacks stable
  const historyRef = useRef<string[]>([normalizePath(initialPath)])
  const historyIndexRef = useRef(0)

  // rerender-functional-setstate: stable callback with no dependencies
  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    const normalizedPath = normalizePath(path)

    if (options?.replace) {
      historyRef.current[historyIndexRef.current] = normalizedPath
    } else {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
      historyRef.current.push(normalizedPath)
      historyIndexRef.current += 1
    }

    setPathname(normalizedPath)
  }, [])

  const back = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1
      setPathname(historyRef.current[historyIndexRef.current])
    }
  }, [])

  const forward = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1
      setPathname(historyRef.current[historyIndexRef.current])
    }
  }, [])

  const updateParams = useCallback((newParams: RouteParams) => {
    setParams(newParams)
  }, [])

  const contextValue = useMemo<RouterContextValue>(
    () => ({
      pathname,
      params,
      navigate,
      back,
      forward,
      updateParams,
    }),
    [pathname, params, navigate, back, forward, updateParams],
  )

  return <RouterContext.Provider value={contextValue}>{children}</RouterContext.Provider>
}
