# @/memory

Persistent key-value storage module built on [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv). ~30x faster than AsyncStorage with full encryption support.

## Installation

```bash
bun add react-native-mmkv
```

For Expo projects, run prebuild:

```bash
npx expo prebuild
```

## Quick Start

```tsx
// config/app.tsx
import { MemoryProvider } from "@/memory"

export default function App() {
  return (
    <MemoryProvider config={{ id: "my-app" }}>
      {/* App content */}
    </MemoryProvider>
  )
}
```

## Usage in Components

```tsx
import { useMemory } from "@/memory"

function UserProfile() {
  const { set, get, remove } = useMemory()

  // Store data
  set("user.name", "John Doe")
  set("user.age", 30)
  set("user.settings", { theme: "dark", notifications: true })

  // Retrieve data
  const name = get<string>("user.name") // "John Doe"
  const age = get<number>("user.age") // 30

  // Remove data
  remove("user.age")

  return (
    <View>
      <Text>{name}</Text>
    </View>
  )
}
```

## Encryption

Enable encryption for sensitive data:

```tsx
<MemoryProvider
  config={{
    id: "secure-storage",
    encryptionKey: "your-secret-key-here",
  }}
>
  {/* App content */}
</MemoryProvider>
```

Change encryption key at runtime:

```tsx
const { recrypt } = useMemory()

// Re-encrypt with new key
recrypt("new-secret-key")

// Or remove encryption
recrypt(undefined)
```

## Multiple Storage Instances

Separate data by domain or user:

```tsx
import { getStorage } from "@/memory"

// Global app settings
const globalStorage = getStorage({ id: "app.global" })

// User-specific data (encrypted)
const userStorage = getStorage({
  id: `user.${userId}`,
  encryptionKey: userEncryptionKey,
})
```

## Caching with TTL

Cache data with automatic expiration:

```tsx
import { useCache } from "@/memory"

function ProductList() {
  const { setCached, getCached, invalidateByTag } = useCache<Product[]>()

  useEffect(() => {
    const products = getCached("products")

    if (!products) {
      // Cache miss - fetch and cache for 5 minutes
      fetchProducts().then((data) => {
        setCached("products", data, 5 * 60 * 1000, ["products"])
      })
    }
  }, [])

  // Invalidate all product caches when user creates a product
  const handleCreate = async () => {
    await createProduct()
    invalidateByTag("products")
  }
}
```

### Cache Configuration

Enable automatic cleanup:

```tsx
<MemoryProvider
  config={{
    id: "my-app",
    cache: {
      defaultTtl: 10 * 60 * 1000, // 10 minutes
      autoCleanup: true, // Clear expired on mount
    },
  }}
>
```

## Typed Value Hooks

Convenience hooks for common data types:

```tsx
import {
  useMemoryString,
  useMemoryNumber,
  useMemoryBoolean,
  useMemoryObject,
} from "@/memory"

function Settings() {
  const [username, setUsername, removeUsername] = useMemoryString("user.username")
  const [fontSize, setFontSize] = useMemoryNumber("settings.font_size")
  const [darkMode, setDarkMode] = useMemoryBoolean("settings.dark_mode")
  const [userPrefs, setUserPrefs] = useMemoryObject<UserPreferences>(
    "user.preferences",
  )

  return (
    <View>
      <Text>Username: {username}</Text>
      <Text>Font size: {fontSize}</Text>
      <Switch value={darkMode ?? false} onValueChange={setDarkMode} />
    </View>
  )
}
```

## Storage Operations

### Basic Operations

```tsx
const { get, set, remove, has, keys, clear, size } = useMemory()

// Store values
set("key", "string value")
set("count", 42)
set("active", true)
set("data", { foo: "bar" })

// Retrieve values
const value = get<string>("key")

// Check existence
const exists = has("key") // boolean

// List all keys
const allKeys = keys() // string[]

// Get storage size in bytes
const bytes = size // number

// Remove single key
remove("key") // boolean

// Clear all data
clear()
```

### Storage Management

```tsx
import { deleteStorage, existsStorage } from "@/memory"

// Check if storage exists
const hasStorage = existsStorage("user.123")

// Delete storage instance completely
const deleted = deleteStorage("user.123")
```

## Cache Statistics

Track cache performance:

```tsx
const { stats, cleanup } = useCache()

useEffect(() => {
  console.log("Cache hits:", stats.hits)
  console.log("Cache misses:", stats.misses)
  console.log("Expired entries:", stats.expired)
  console.log("Total entries:", stats.size)
}, [stats])

// Manually clear expired entries
const cleared = cleanup()
console.log(`Cleared ${cleared} expired entries`)
```

## API

### MemoryProvider Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Child components |
| config | MemoryStorageConfig | Storage configuration |

### MemoryStorageConfig

| Option | Type | Description |
|--------|------|-------------|
| id | string | Storage instance ID (default: "memory.default") |
| encryptionKey | string | Encryption key for secure storage |
| mode | "single-process" \| "multi-process" | Process mode for app extensions |
| cache | CacheConfig | Cache configuration |

### CacheConfig

| Option | Type | Description |
|--------|------|-------------|
| defaultTtl | number | Default time-to-live in milliseconds |
| autoCleanup | boolean | Auto-clear expired entries on mount |

### useMemory Hook

```tsx
const { get, set, remove, has, keys, clear, size, recrypt } = useMemory()
```

| Method | Signature | Description |
|--------|-----------|-------------|
| get | `<T>(key: string) => T \| null` | Retrieve value |
| set | `(key: string, value: any) => void` | Store value |
| remove | `(key: string) => boolean` | Remove key |
| has | `(key: string) => boolean` | Check if key exists |
| keys | `() => string[]` | Get all keys |
| clear | `() => void` | Remove all keys |
| size | `number` | Storage size in bytes |
| recrypt | `(key?: string) => void` | Change encryption |

### useCache Hook

```tsx
const { getCached, setCached, invalidateByTag, cleanup, stats } = useCache<T>()
```

| Method | Signature | Description |
|--------|-----------|-------------|
| getCached | `(key: string) => T \| null` | Get cached value (null if expired) |
| setCached | `(key: string, value: T, ttl?: number, tags?: string[]) => void` | Cache with optional TTL and tags |
| invalidateByTag | `(tag: string) => void` | Remove all entries with tag |
| cleanup | `() => number` | Clear expired entries, return count |
| stats | CacheStats | { hits, misses, size, expired } |

### Typed Hooks

| Hook | Return Type | Description |
|------|-------------|-------------|
| useMemoryString | `[string \| null, (v: string) => void, () => void]` | String values |
| useMemoryNumber | `[number \| null, (v: number) => void, () => void]` | Number values |
| useMemoryBoolean | `[boolean \| null, (v: boolean) => void, () => void]` | Boolean values |
| useMemoryObject<T> | `[T \| null, (v: T) => void, () => void]` | Object values |

## Storage Location

- **iOS**: App Documents directory
- **Android**: App files directory
- **Web**: localStorage (with in-memory fallback if disabled)

## Performance

MMKV uses JSI (JavaScript Interface) for synchronous native method calls:

- **No async/await overhead**
- **No Bridge bottleneck**
- **~30x faster than AsyncStorage**

Benchmark (1000 reads on iPhone 11 Pro):

| Storage | Time (ms) |
|---------|-----------|
| MMKV | ~1.5 |
| AsyncStorage | ~45 |

## Module Structure

```
memory/
├── index.ts      # Barrel exports
├── types.ts      # TypeScript interfaces
├── storage.ts    # MMKV wrapper and cache operations
├── context.tsx   # MemoryProvider
├── hooks.ts      # useMemory, useCache, typed hooks
└── readme.md     # This file
```
