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
      {/* App content */}
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
    // Some operation
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

## Sampling (Log Filtering)

Afterlog uses **sampling rules** to filter which events get logged, rather than traditional log levels.

```tsx
import { LoggerProvider, createHybridAdapter, errorRule, createLatencyRule } from "@/logger"

export default function App() {
  return (
    <LoggerProvider
      adapter={await createHybridAdapter({ console: true })}
      sampling={{
        rules: [
          errorRule,  // Always log errors
          createLatencyRule({ threshold_ms: 1000, sample_rate: 1.0 }),  // Log slow requests
        ],
        default_rate: 0.05,  // 5% of everything else
      }}
    >
      {/* App content */}
    </LoggerProvider>
  )
}
```

### Built-in Sampling Rules

| Rule | Description |
|------|-------------|
| `errorRule` | Always samples events with errors |
| `createLatencyRule({ threshold_ms, sample_rate })` | Samples slow requests |
| `createRandomRule(rate, priority?)` | Random sampling (0-1) |
| `createConsistentRule({ sample_rate })` | Same trace_id = same sampling decision |

### Custom Sampling Rules

```tsx
const vipRule: SamplingRule = {
  name: "vip_users",
  priority: 5,
  evaluate: (event) => {
    if (event.user_tier === "vip") {
      return { sampled: true, rate: 1.0, reason: "vip" }
    }
  }
}

<LoggerProvider
  adapter={adapter}
  sampling={{ rules: [vipRule], default_rate: 0.01 }}
>
```

Rules are evaluated by priority (lowest first). First rule with a result wins.

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
| adapter | LoggerAdapter | Custom adapter |
| sampling | SamplingConfig | Sampling rules for log filtering |
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

- **iOS**: `FileSystem.Paths.document + "logs/"`
- **Android**: `FileSystem.Paths.document + "logs/"`

Files are in JSONL format (one JSON object per line).
