/**
 * @/memory/storage - MMKV storage wrapper
 *
 * Core storage implementation using react-native-mmkv.
 * Provides synchronous key-value storage with encryption support.
 */

import { createMMKV, type MMKV } from "react-native-mmkv"
import type {
  MemoryStorageConfig,
  MemoryInstance,
  StorageKey,
  StorageValue,
  CacheEntry,
  MMKVInstance,
} from "./types"

// =============================================================================
// Storage Instance Management
// =============================================================================

const instances = new Map<string, MMKV>()

/**
 * Create or get an existing MMKV storage instance
 */
export function getStorage(config?: MemoryStorageConfig): MemoryInstance {
  const id = config?.id ?? "memory.default"

  if (!instances.has(id)) {
    const mmkvConfig: Parameters<typeof createMMKV>[0] = {
      id,
    }

    if (config?.encryptionKey) {
      mmkvConfig.encryptionKey = config.encryptionKey
    }

    if (config?.mode) {
      mmkvConfig.mode = config.mode
    }

    const storage = createMMKV(mmkvConfig)
    instances.set(id, storage)

    return {
      id,
      storage: storage as unknown as MMKVInstance,
      cacheConfig: config?.cache,
    }
  }

  const storage = instances.get(id)!
  return {
    id,
    storage: storage as unknown as MMKVInstance,
    cacheConfig: config?.cache,
  }
}

/**
 * Delete a storage instance
 */
export function deleteStorage(id: string): boolean {
  const { deleteMMKV } = require("react-native-mmkv")
  instances.delete(id)
  return deleteMMKV(id)
}

/**
 * Check if a storage instance exists
 */
export function existsStorage(id: string): boolean {
  const { existsMMKV } = require("react-native-mmkv")
  return existsMMKV(id)
}

// =============================================================================
// Core Storage Operations
// =============================================================================

export function getString(storage: MMKV, key: StorageKey): string | null {
  return storage.getString(key) ?? null
}

export function getNumber(storage: MMKV, key: StorageKey): number | null {
  const value = storage.getNumber(key)
  return value === undefined ? null : value
}

export function getBoolean(storage: MMKV, key: StorageKey): boolean | null {
  const value = storage.getBoolean(key)
  return value === undefined ? null : value
}

export function getBuffer(storage: MMKV, key: StorageKey): ArrayBuffer | null {
  return storage.getBuffer(key) ?? null
}

export function getObject<T = unknown>(storage: MMKV, key: StorageKey): T | null {
  const json = storage.getString(key)
  if (!json) return null
  try {
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

export function setValue(storage: MMKV, key: StorageKey, value: StorageValue): void {
  if (typeof value === "string") {
    storage.set(key, value)
  } else if (typeof value === "number") {
    storage.set(key, value)
  } else if (typeof value === "boolean") {
    storage.set(key, value)
  } else if (value instanceof ArrayBuffer) {
    storage.set(key, value)
  } else if (typeof value === "object" && value !== null) {
    storage.set(key, JSON.stringify(value))
  }
}

/**
 * Remove a key from storage.
 * The MMKV v4 types are missing the remove() method, but it exists at runtime.
 */
export function removeValue(storage: MMKV, key: StorageKey): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (storage as any).remove(key)
}

export function hasKey(storage: MMKV, key: StorageKey): boolean {
  return storage.contains(key)
}

export function getAllKeys(storage: MMKV): string[] {
  return storage.getAllKeys()
}

export function clearStorage(storage: MMKV): void {
  storage.clearAll()
}

export function getStorageSize(storage: MMKV): number {
  return storage.size
}

export function reencryptStorage(storage: MMKV, encryptionKey?: string): void {
  storage.recrypt(encryptionKey)
}

export function trimStorage(storage: MMKV): void {
  storage.trim()
}

// =============================================================================
// Cache Operations
// =============================================================================

const CACHE_PREFIX = "__cache__"

export function getCacheEntry<T>(storage: MMKV, key: StorageKey): CacheEntry<T> | null {
  const fullKey = `${CACHE_PREFIX}${key}`
  const json = storage.getString(fullKey)
  if (!json) return null

  try {
    const entry = JSON.parse(json) as CacheEntry<T>

    // Check if expired
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(storage as any).remove(fullKey)
      return null
    }

    return entry
  } catch {
    return null
  }
}

export function setCacheEntry<T>(
  storage: MMKV,
  key: StorageKey,
  data: T,
  ttl?: number,
  tags?: string[],
): void {
  const fullKey = `${CACHE_PREFIX}${key}`
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    expiresAt: ttl ? Date.now() + ttl : undefined,
    tags,
  }
  storage.set(fullKey, JSON.stringify(entry))
}

export function invalidateCacheByTag(storage: MMKV, tag: string): void {
  const keys = storage.getAllKeys()
  for (const key of keys) {
    if (!key.startsWith(CACHE_PREFIX)) continue

    const json = storage.getString(key)
    if (!json) continue

    try {
      const entry = JSON.parse(json) as CacheEntry<unknown>
      if (entry.tags?.includes(tag)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(storage as any).remove(key)
      }
    } catch {
      // Skip invalid entries
    }
  }
}

export function cleanupExpiredCache(storage: MMKV): number {
  const keys = storage.getAllKeys()
  let cleared = 0
  const now = Date.now()

  for (const key of keys) {
    if (!key.startsWith(CACHE_PREFIX)) continue

    const json = storage.getString(key)
    if (!json) continue

    try {
      const entry = JSON.parse(json) as CacheEntry<unknown>
      if (entry.expiresAt && entry.expiresAt < now) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(storage as any).remove(key)
        cleared++
      }
    } catch {
      // Skip invalid entries
    }
  }

  return cleared
}

// =============================================================================
// Export Default Instance
// =============================================================================

export const defaultStorage = getStorage()
