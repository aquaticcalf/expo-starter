# @/logger

Structured logging module built on [afterlog](https://www.npmjs.com/package/afterlog).

## Installation

```bash
bun add afterlog expo-file-system
```

## Quick Start

```tsx
// config/app.tsx
import { LoggerProvider, createHybridAdapter } from "@/logger"

export default function App() {
  return (
    <LoggerProvider
      adapter={await createHybridAdapter({
        console: true,
        file: { filename: "app.jsonl" },
      })}
    >
      {/* app content */}
    </LoggerProvider>
  )
}
```

## Usage in Components

```tsx
import { useLogger } from "@/logger"

function MyComponent() {
  const { info, error } = useLogger()

  info("Component mounted", { component: "MyComponent" })

  try {
    // some operation
  } catch (err) {
    error("Operation failed", err as Error, { component: "MyComponent" })
  }
}
```

## Request Logging

For tracking individual requests or operations:

```tsx
import { useRequestLogger } from "@/logger"

function UserProfile({ userId }: { userId: string }) {
  const log = useRequestLogger(`user-${userId}`, { user_id: userId })

  useEffect(() => {
    log.set("action", "fetch_profile")
    log.timing("api", () => fetchUser(userId))
    log.finalize()
  }, [userId])
}
```

## Adapters

### Console Adapter

For development - logs to console in readable format:

```tsx
import { createConsoleLogAdapter } from "@/logger"

const adapter = createConsoleLogAdapter()
```

### File Adapter

For persistent logging to device storage:

```tsx
import { createFileAdapter } from "@/logger"

const adapter = await createFileAdapter({
  directory: `${FileSystem.documentDirectory}logs/`,
  filename: "app.jsonl",
  maxFiles: 5,
})
```

### Hybrid Adapter

Logs to both console and file:

```tsx
import { createHybridAdapter } from "@/logger"

const adapter = await createHybridAdapter({
  console: true,
  file: { filename: "app.jsonl" },
})
```

## API

### LoggerProvider Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Child components |
| adapter | LoggerAdapter | Custom adapter (optional) |
| level | LogLevel | Minimum log level |
| service | string | Service name for logs |
| version | string | Version for logs |

### useLogger Hook

```tsx
const { debug, info, warn, error } = useLogger()

debug("Debug message", { key: "value" })
info("Info message", { key: "value" })
warn("Warning message", { key: "value" })
error("Error message", errorInstance, { key: "value" })
```

### useRequestLogger Hook

```tsx
const log = useRequestLogger("request-id", { user_id: "123" })

log.set("action", "create")
log.timing("db", () => db.insert(data))
await log.finalize()
```

## Log Storage

Logs are stored in:

- **iOS**: `FileSystem.documentDirectory + "logs/"`
- **Android**: `FileSystem.documentDirectory + "logs/"`

Files are rotated with `.1`, `.2`, etc. suffixes when they reach capacity.
