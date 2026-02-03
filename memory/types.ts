/**
 * @/memory - Persistent key-value storage module built on react-native-mmkv
 *
 * Provides fast, synchronous, encrypted storage for caching and persistence.
 * Supports multiple storage instances, encryption, and React hooks.
 */

// =============================================================================
// MMKV Types
// =============================================================================

export interface MMKVInstance {
  id: string
  path?: string
  encryptionKey?: string
  mode?: "single-process" | "multi-process"
  readOnly?: boolean
}

export type StorageValue = string | number | boolean | ArrayBuffer | object

export type StorageKey = string

// =============================================================================
// Cache Types
// =============================================================================

export interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  expiresAt?: number
  tags?: string[]
}

export interface CacheConfig {
  /** Default TTL in milliseconds */
  defaultTtl?: number
  /** Maximum number of entries */
  maxSize?: number
  /** Enable automatic cleanup of expired entries */
  autoCleanup?: boolean
}

export interface CacheStats {
  hits: number
  misses: number
  size: number
  expired: number
}

// =============================================================================
// Memory Module Types
// =============================================================================

export interface MemoryStorageConfig {
  /** Storage instance ID */
  id?: string
  /** Encryption key for secure storage */
  encryptionKey?: string
  /** Multi-process mode for app extensions */
  mode?: "single-process" | "multi-process"
  /** Cache configuration */
  cache?: CacheConfig
}

export interface MemoryInstance {
  id: string
  storage: MMKVInstance
  cacheConfig?: CacheConfig
}

export interface UseMemoryReturn {
  /** Get a value from storage */
  get: <T = string>(key: StorageKey) => T | null
  /** Set a value in storage */
  set: (key: StorageKey, value: StorageValue) => void
  /** Remove a key from storage */
  remove: (key: StorageKey) => boolean
  /** Check if key exists */
  has: (key: StorageKey) => boolean
  /** Get all keys */
  keys: () => string[]
  /** Clear all storage */
  clear: () => void
  /** Get storage size in bytes */
  size: number
  /** Re-encrypt storage with new key */
  recrypt: (encryptionKey?: string) => void
}

export interface UseCacheReturn<T = unknown> extends UseMemoryReturn {
  /** Get cached value, returns null if expired */
  getCached: (key: StorageKey) => T | null
  /** Set value with optional TTL */
  setCached: (key: StorageKey, value: T, ttl?: number, tags?: string[]) => void
  /** Invalidate cache entries by tag */
  invalidateByTag: (tag: string) => void
  /** Clear all expired entries */
  cleanup: () => void
  /** Get cache statistics */
  stats: CacheStats
}

// =============================================================================
// Provider Types
// =============================================================================

export interface MemoryProviderProps {
  children: React.ReactNode
  config?: MemoryStorageConfig
}

export interface MemoryContextValue {
  instance: MemoryInstance | null
  configure: (config: MemoryStorageConfig) => void
  isReady: boolean
}
