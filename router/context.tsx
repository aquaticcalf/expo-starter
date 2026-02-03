import { createContext, useCallback, useMemo, useRef, useState } from "react"
import type { RouterContextValue, RouterProviderProps, RouteParams } from "./types"
import { normalizePath } from "./utils"

// Maximum history length to prevent unbounded memory growth.
const HISTORY_MAX_LENGTH = 100

export const RouterContext = createContext<RouterContextValue | null>(null)

export function RouterProvider({ children, initialPath = "/" }: RouterProviderProps) {
  // Use lazy initializer to avoid recomputing normalized path on every render.
  const [pathname, setPathname] = useState(() => normalizePath(initialPath))
  const [params, setParams] = useState<RouteParams>({})

  // Store history in refs to avoid stale closures in callbacks.
  // This keeps navigation functions stable (no deps on mutable history).
  const historyRef = useRef<string[]>([normalizePath(initialPath)])
  const historyIndexRef = useRef(0)

  // Navigate to a new path. Optionally replace current history entry.
  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    const normalizedPath = normalizePath(path)

    if (options?.replace) {
      // Replace current entry without adding to history.
      historyRef.current[historyIndexRef.current] = normalizedPath
    } else {
      // Truncate forward history and append new entry.
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
      historyRef.current.push(normalizedPath)
      historyIndexRef.current += 1

      // Enforce history limit to prevent memory leaks in long sessions.
      if (historyRef.current.length > HISTORY_MAX_LENGTH) {
        const overflow = historyRef.current.length - HISTORY_MAX_LENGTH
        historyRef.current = historyRef.current.slice(overflow)
        historyIndexRef.current = Math.max(0, historyIndexRef.current - overflow)
      }
    }

    setPathname(normalizedPath)
  }, [])

  // Navigate backward in history if possible.
  const back = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1
      setPathname(historyRef.current[historyIndexRef.current])
    }
  }, [])

  // Navigate forward in history if possible.
  const forward = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1
      setPathname(historyRef.current[historyIndexRef.current])
    }
  }, [])

  // Update route params when route changes.
  const updateParams = useCallback((newParams: RouteParams) => {
    setParams(newParams)
  }, [])

  // Memoize context value to prevent unnecessary re-renders of consumers.
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
