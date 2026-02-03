/**
 * @/memory/hooks - React hooks for memory storage
 *
 * Provides hooks for accessing and manipulating persistent storage.
 * Includes hooks for basic storage and cache management.
 */

import { useContext, useCallback, useMemo, useState, useEffect } from "react"
import { MemoryContext } from "./context"
import type { StorageKey, StorageValue, UseMemoryReturn, UseCacheReturn, CacheStats } from "./types"
import {
  getString,
  setValue,
  removeValue,
  hasKey,
  getAllKeys,
  clearStorage,
  getStorageSize,
  reencryptStorage,
  getCacheEntry,
  setCacheEntry,
  invalidateCacheByTag,
  cleanupExpiredCache,
} from "./storage"

// =============================================================================
// Core Storage Hook
// =============================================================================

/**
 * Hook to access the memory storage instance
 * Must be used within a MemoryProvider
 */
export function useMemory(): UseMemoryReturn {
  const context = useContext(MemoryContext)

  if (!context) {
    throw new Error("useMemory must be used within a MemoryProvider")
  }

  if (!context.storage) {
    throw new Error(
      "Memory storage not initialized. Call configure() first or provide initial config to MemoryProvider.",
    )
  }

  const storage = context.storage

  const get = useCallback(
    <T = string>(key: StorageKey): T | null => {
      const value = getString(storage, key)
      if (value === null) return null

      try {
        return JSON.parse(value) as T
      } catch {
        return value as unknown as T
      }
    },
    [storage],
  )

  const set = useCallback(
    (key: StorageKey, value: StorageValue) => {
      setValue(storage, key, value)
    },
    [storage],
  )

  const remove = useCallback(
    (key: StorageKey): boolean => {
      return removeValue(storage, key)
    },
    [storage],
  )

  const has = useCallback(
    (key: StorageKey): boolean => {
      return hasKey(storage, key)
    },
    [storage],
  )

  const keys = useCallback((): string[] => {
    return getAllKeys(storage)
  }, [storage])

  const clear = useCallback(() => {
    clearStorage(storage)
  }, [storage])

  const size = useMemo(() => {
    return getStorageSize(storage)
  }, [storage])

  const recrypt = useCallback(
    (encryptionKey?: string) => {
      reencryptStorage(storage, encryptionKey)
    },
    [storage],
  )

  return useMemo(
    () => ({
      get,
      set,
      remove,
      has,
      keys,
      clear,
      size,
      recrypt,
    }),
    [get, set, remove, has, keys, clear, size, recrypt],
  )
}

// =============================================================================
// Cache Hook
// =============================================================================

/**
 * Hook to access cache functionality with TTL and tags
 */
export function useCache<T = unknown>(): UseCacheReturn<T> {
  const memory = useMemory()
  const context = useContext(MemoryContext)
  const storage = context!.storage!

  const [stats, setStats] = useState<CacheStats>({
    hits: 0,
    misses: 0,
    size: 0,
    expired: 0,
  })

  const getCached = useCallback(
    (key: StorageKey): T | null => {
      const entry = getCacheEntry<T>(storage, key)

      if (entry) {
        setStats((prev) => ({ ...prev, hits: prev.hits + 1 }))
        return entry.data
      }

      setStats((prev) => ({ ...prev, misses: prev.misses + 1 }))
      return null
    },
    [storage],
  )

  const setCached = useCallback(
    (key: StorageKey, value: T, ttl?: number, tags?: string[]) => {
      setCacheEntry(storage, key, value, ttl, tags)
      setStats((prev) => ({ ...prev, size: prev.size + 1 }))
    },
    [storage],
  )

  const invalidateByTag = useCallback(
    (tag: string) => {
      invalidateCacheByTag(storage, tag)
    },
    [storage],
  )

  const cleanup = useCallback(() => {
    const cleared = cleanupExpiredCache(storage)
    setStats((prev) => ({ ...prev, expired: prev.expired + cleared }))
  }, [storage])

  // Auto cleanup on mount
  useEffect(() => {
    const autoCleanup = context?.instance?.cacheConfig?.autoCleanup ?? false
    if (autoCleanup) {
      cleanup()
    }
  }, [cleanup, context?.instance?.cacheConfig?.autoCleanup])

  return useMemo(
    () => ({
      ...memory,
      getCached,
      setCached,
      invalidateByTag,
      cleanup,
      stats,
    }),
    [memory, getCached, setCached, invalidateByTag, cleanup, stats],
  )
}

// =============================================================================
// Typed Storage Hooks
// =============================================================================

/**
 * Hook for string values
 */
export function useMemoryString(
  key: StorageKey,
): [string | null, (value: string) => void, () => void] {
  const { get, set, remove } = useMemory()

  const value = useMemo(() => {
    const result = get<string>(key)
    return typeof result === "string" ? result : null
  }, [get, key])

  const setValue = useCallback(
    (newValue: string) => {
      set(key, newValue)
    },
    [set, key],
  )

  const removeValue = useCallback(() => {
    remove(key)
  }, [remove, key])

  return [value, setValue, removeValue]
}

/**
 * Hook for number values
 */
export function useMemoryNumber(
  key: StorageKey,
): [number | null, (value: number) => void, () => void] {
  const { get, set, remove } = useMemory()

  const value = useMemo(() => {
    const result = get<number>(key)
    return typeof result === "number" ? result : null
  }, [get, key])

  const setValue = useCallback(
    (newValue: number) => {
      set(key, newValue)
    },
    [set, key],
  )

  const removeValue = useCallback(() => {
    remove(key)
  }, [remove, key])

  return [value, setValue, removeValue]
}

/**
 * Hook for boolean values
 */
export function useMemoryBoolean(
  key: StorageKey,
): [boolean | null, (value: boolean) => void, () => void] {
  const { get, set, remove } = useMemory()

  const value = useMemo(() => {
    const result = get<boolean>(key)
    return typeof result === "boolean" ? result : null
  }, [get, key])

  const setValue = useCallback(
    (newValue: boolean) => {
      set(key, newValue)
    },
    [set, key],
  )

  const removeValue = useCallback(() => {
    remove(key)
  }, [remove, key])

  return [value, setValue, removeValue]
}

/**
 * Hook for object values
 */
export function useMemoryObject<T = unknown>(
  key: StorageKey,
): [T | null, (value: T) => void, () => void] {
  const { get, set, remove } = useMemory()

  const value = useMemo(() => {
    return get<T>(key)
  }, [get, key])

  const setValue = useCallback(
    (newValue: T) => {
      set(key, newValue as StorageValue)
    },
    [set, key],
  )

  const removeValue = useCallback(() => {
    remove(key)
  }, [remove, key])

  return [value, setValue, removeValue]
}
