/**
 * @/memory - Persistent key-value storage module built on react-native-mmkv
 *
 * Provides fast, synchronous, encrypted storage for caching and persistence.
 * ~30x faster than AsyncStorage with full TypeScript support.
 *
 * @example
 * ```tsx
 * import { MemoryProvider, useMemory, useCache } from "@/memory"
 *
 * // In app entry
 * export default function App() {
 *   return (
 *     <MemoryProvider config={{ id: "my-app", encryptionKey: "secret" }}>
 *       <YourApp />
 *     </MemoryProvider>
 *   )
 * }
 *
 * // In components
 * function MyComponent() {
 *   const { set, get } = useMemory()
 *
 *   // Basic storage
 *   set("user.name", "John")
 *   const name = get("user.name")
 *
 *   return <Text>{name}</Text>
 * }
 *
 * // With caching
 * function MyCachedComponent() {
 *   const { setCached, getCached } = useCache<User>()
 *
 *   // Cache with 5 minute TTL
 *   setCached("user", userData, 5 * 60 * 1000, ["user-data"])
 *
 *   // Get cached value (null if expired)
 *   const user = getCached("user")
 * }
 * ```
 */

// =============================================================================
// Context & Provider
// =============================================================================

export { MemoryProvider, MemoryContext } from "./context"

// =============================================================================
// Hooks
// =============================================================================

export {
  useMemory,
  useCache,
  useMemoryString,
  useMemoryNumber,
  useMemoryBoolean,
  useMemoryObject,
} from "./hooks"

// =============================================================================
// Storage Utilities
// =============================================================================

export {
  getStorage,
  deleteStorage,
  existsStorage,
  getString,
  getNumber,
  getBoolean,
  getBuffer,
  getObject,
  setValue,
  removeValue,
  hasKey,
  getAllKeys,
  clearStorage,
  getStorageSize,
  reencryptStorage,
  trimStorage,
  getCacheEntry,
  setCacheEntry,
  invalidateCacheByTag,
  cleanupExpiredCache,
  defaultStorage,
} from "./storage"

// =============================================================================
// Types
// =============================================================================

export type {
  MMKVInstance,
  StorageValue,
  StorageKey,
  CacheEntry,
  CacheConfig,
  CacheStats,
  MemoryStorageConfig,
  MemoryInstance,
  UseMemoryReturn,
  UseCacheReturn,
  MemoryContextValue,
} from "./types"
