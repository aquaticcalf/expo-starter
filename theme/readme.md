# Theme

Design token system for React Native with light/dark mode support.

Three tiers:
- Primitives → raw values (colors, numbers). Never use directly.
- Semantic tokens → meaning-based (`background.surface`, `foreground.muted`)
- Themes → complete set mapping semantics to primitives

## Setup

### 1. Wrap app with ThemeProvider

```tsx
// app.tsx
import { ThemeProvider } from "@/theme"
import { FileSystemRouter } from "@/router"

export default function App() {
  return (
    <ThemeProvider>
      <FileSystemRouter pagesDir="../pages" />
    </ThemeProvider>
  )
}
```

### 2. Use theme in components

```tsx
import { View, Text } from "react-native"
import { useThemedStyles } from "@/theme"

export default function Card() {
  const styles = useThemedStyles((t) => ({
    container: {
      backgroundColor: t.colors.background.surface,
      padding: t.spacing[4],
      borderRadius: t.radius.md,
      borderWidth: 1,
      borderColor: t.colors.border.default,
    },
    title: {
      color: t.colors.foreground.default,
      fontSize: t.typography.scale.lg.fontSize,
      fontWeight: t.typography.weights.semibold,
    },
  }))

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Card Title</Text>
    </View>
  )
}
```

## Hooks

### useTheme

Full theme context with mode switching.

```tsx
import { useTheme } from "@/theme"

function Component() {
  const { theme, isDark, toggleTheme, setThemeMode } = useTheme()

  // theme         → current theme object
  // isDark        → boolean, true if dark mode
  // toggleTheme   → switch between light/dark
  // setThemeMode  → set to "light", "dark", or "system"
}
```

### useThemedStyles

Create memoized stylesheets that update with theme.

```tsx
import { useThemedStyles } from "@/theme"

function Component() {
  const styles = useThemedStyles((theme) => ({
    container: {
      backgroundColor: theme.colors.background.app,
      padding: theme.spacing[4],
    },
    text: {
      color: theme.colors.foreground.default,
      ...theme.typography.scale.base,
    },
  }))

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  )
}
```

### createThemedStyleSheet

Define styles outside components, returns a hook.

```tsx
// styles.ts
import { createThemedStyleSheet } from "@/theme"

export const useStyles = createThemedStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background.surface,
    padding: theme.spacing[4],
  },
}))

// Component.tsx
import { useStyles } from "./styles"

function Component() {
  const styles = useStyles()
  return <View style={styles.container} />
}
```

### Convenience Hooks

```tsx
import {
  useColors,
  useSpacing,
  useTypography,
  useRadius,
  useShadows,
  useIsDark,
} from "@/theme"

function Component() {
  const colors = useColors()      // theme.colors
  const spacing = useSpacing()    // theme.spacing
  const typography = useTypography() // theme.typography
  const radius = useRadius()      // theme.radius
  const shadows = useShadows()    // theme.shadows
  const isDark = useIsDark()      // boolean
}
```

## Token Reference

### Colors

Semantic color tokens organized by purpose.

```tsx
const { colors } = useTheme().theme

// Backgrounds
colors.background.app          // Main app background
colors.background.surface      // Card/component background
colors.background.surfaceHover // Hover state
colors.background.elevated     // Elevated surfaces (modals)
colors.background.muted        // Subtle backgrounds
colors.background.inverse      // Inverted background

// Foreground/text
colors.foreground.default      // Primary text
colors.foreground.muted        // Secondary text
colors.foreground.subtle       // Tertiary text
colors.foreground.inverse      // Text on inverse background
colors.foreground.disabled     // Disabled state

// Brand
colors.brand.default           // Primary brand color
colors.brand.hover             // Hover state
colors.brand.active            // Pressed state
colors.brand.subtle            // Light brand background
colors.brand.foreground        // Text on brand color

// Borders
colors.border.default          // Standard borders
colors.border.muted            // Subtle borders
colors.border.focus            // Focus rings

// Status
colors.success.default         // Success states
colors.warning.default         // Warning states
colors.error.default           // Error states
colors.info.default            // Info states

// Each status has: default, hover, active, subtle, muted, emphasis, foreground, border
```

### Spacing

4px base grid, following Tailwind scale.

```tsx
const { spacing } = useTheme().theme

spacing[0]    // 0
spacing[1]    // 4
spacing[2]    // 8
spacing[3]    // 12
spacing[4]    // 16
spacing[6]    // 24
spacing[8]    // 32
spacing[12]   // 48
spacing[16]   // 64
spacing[24]   // 96
```

### Typography

Font sizes with paired line heights.

```tsx
const { typography } = useTheme().theme

// Scale (fontSize, lineHeight, letterSpacing)
typography.scale.xs      // { fontSize: 12, lineHeight: 16, letterSpacing: 0.4 }
typography.scale.sm      // { fontSize: 14, lineHeight: 20, letterSpacing: 0.25 }
typography.scale.base    // { fontSize: 16, lineHeight: 24, letterSpacing: 0 }
typography.scale.lg      // { fontSize: 18, lineHeight: 28, letterSpacing: 0 }
typography.scale.xl      // { fontSize: 20, lineHeight: 28, letterSpacing: 0 }
typography.scale["2xl"]  // { fontSize: 24, lineHeight: 32, letterSpacing: 0 }
typography.scale["3xl"]  // { fontSize: 30, lineHeight: 36, letterSpacing: 0 }

// Weights
typography.weights.normal    // "400"
typography.weights.medium    // "500"
typography.weights.semibold  // "600"
typography.weights.bold      // "700"

// Families
typography.families.sans     // "System"
typography.families.mono     // "Menlo"
```

### Radius

Border radius scale.

```tsx
const { radius } = useTheme().theme

radius.none   // 0
radius.sm     // 4
radius.md     // 8
radius.lg     // 12
radius.xl     // 16
radius.full   // 9999
```

### Shadows

Elevation/shadow definitions for React Native.

```tsx
const { shadows } = useTheme().theme

shadows.none  // No shadow
shadows.sm    // Subtle shadow
shadows.md    // Medium shadow
shadows.lg    // Large shadow

// Each shadow is: { shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation }
```

### Sizes

Common UI element sizes.

```tsx
const { sizes } = useTheme().theme

sizes.touchTarget  // 44 (minimum touch target)
sizes.iconSm       // 16
sizes.iconMd       // 20
sizes.iconLg       // 24
sizes.buttonSm     // 32
sizes.buttonMd     // 40
sizes.buttonLg     // 48
```

## Duration (Animation Timing)

All duration values are in milliseconds.

```tsx
const { duration } = useTheme().theme

duration.instant  // 0ms - No animation
duration.fast     // 100ms - Micro-interactions
duration.normal   // 200ms - Standard transitions
duration.slow     // 300ms - Deliberate animations
duration.slower   // 500ms - Emphasized transitions
duration.slowest  // 1000ms - Long-form animations
```

## Dark Mode

### Automatic System Detection

```tsx
<ThemeProvider defaultMode="system">
  <App />
</ThemeProvider>
```

### Manual Toggle

```tsx
import { useTheme } from "@/theme"

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button
      title={isDark ? "Switch to Light" : "Switch to Dark"}
      onPress={toggleTheme}
    />
  )
}
```

### Set Specific Mode

```tsx
const { setThemeMode } = useTheme()

setThemeMode("light")   // Force light
setThemeMode("dark")    // Force dark
setThemeMode("system")  // Follow system
```

### Persist Preference

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage"

function App() {
  const [initialMode, setInitialMode] = useState<ThemeMode>("system")

  useEffect(() => {
    AsyncStorage.getItem("themeMode").then((mode) => {
      if (mode) setInitialMode(mode as ThemeMode)
    })
  }, [])

  return (
    <ThemeProvider
      defaultMode={initialMode}
      onThemeModeChange={(mode) => AsyncStorage.setItem("themeMode", mode)}
    >
      <App />
    </ThemeProvider>
  )
}
```

## Custom Themes

### Override Default Themes

```tsx
import { ThemeProvider, lightTheme, darkTheme } from "@/theme"

const customLight = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    brand: {
      ...lightTheme.colors.brand,
      default: "#FF6B00", // Custom brand color
    },
  },
}

<ThemeProvider lightTheme={customLight}>
  <App />
</ThemeProvider>
```

### Create Theme From Scratch

```tsx
import type { Theme } from "@/theme"
import { spacing, radius, zIndex, duration, opacity, sizes } from "@/theme"

const customTheme: Theme = {
  name: "custom",
  mode: "light",
  colors: {
    background: { /* ... */ },
    foreground: { /* ... */ },
    brand: { /* ... */ },
    // ...
  },
  spacing,
  typography: { /* ... */ },
  radius,
  shadows: { /* ... */ },
  zIndex,
  duration,
  opacity,
  sizes,
}
```

## API Reference

### ThemeProvider

Main provider component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultMode | `"light" \| "dark" \| "system"` | `"system"` | Initial theme mode |
| lightTheme | `Theme` | built-in | Custom light theme |
| darkTheme | `Theme` | built-in | Custom dark theme |
| onThemeModeChange | `(mode: ThemeMode) => void` | - | Callback when mode changes |
| children | `ReactNode` | required | App content |

### useTheme Return Value

| Property | Type | Description |
|----------|------|-------------|
| theme | `Theme` | Current theme object |
| themeMode | `ThemeMode` | Current setting (light/dark/system) |
| resolvedMode | `"light" \| "dark"` | Actual mode after system resolution |
| isDark | `boolean` | True if dark mode active |
| setThemeMode | `(mode: ThemeMode) => void` | Set theme mode |
| toggleTheme | `() => void` | Toggle between light/dark |

## Module Structure

```
theme/
├── index.ts          # Barrel exports
├── types.ts          # TypeScript interfaces
├── primitives.ts     # Raw token values
├── context.tsx       # ThemeProvider, context
├── hooks.ts          # useTheme, useThemedStyles, etc.
├── themes/
│   ├── light.ts      # Light theme
│   └── dark.ts       # Dark theme
└── readme.md         # This file
```

## Color Scale Reference

Primitives use 12-step color scales (Radix convention):

| Step | Use Case |
|------|----------|
| 1-2 | Backgrounds |
| 3-5 | Component backgrounds (normal, hover, active) |
| 6-8 | Borders (subtle, normal, strong) |
| 9-10 | Solid backgrounds (normal, hover) |
| 11-12 | Text (low contrast, high contrast) |
