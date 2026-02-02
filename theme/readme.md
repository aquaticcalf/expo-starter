# theme

design token system for react native with light/dark mode support.

three tiers:
- primitives → raw values (colors, numbers). never use directly
- semantic tokens → meaning-based (`background.surface`, `foreground.muted`)
- themes → complete set mapping semantics to primitives

## setup

### 1. wrap app with ThemeProvider

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

### 2. use theme in components

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

## hooks

### useTheme

full theme context with mode switching.

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

create memoized stylesheets that update with theme.

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

define styles outside components, returns a hook.

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

### convenience hooks

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

## token reference

### colors

semantic color tokens organized by purpose.

```tsx
const { colors } = useTheme().theme

// backgrounds
colors.background.app          // main app background
colors.background.surface      // card/component background
colors.background.surfaceHover // hover state
colors.background.elevated     // elevated surfaces (modals)
colors.background.muted        // subtle backgrounds
colors.background.inverse      // inverted background

// foreground/text
colors.foreground.default      // primary text
colors.foreground.muted        // secondary text
colors.foreground.subtle       // tertiary text
colors.foreground.inverse      // text on inverse background
colors.foreground.disabled     // disabled state

// brand
colors.brand.default           // primary brand color
colors.brand.hover             // hover state
colors.brand.active            // pressed state
colors.brand.subtle            // light brand background
colors.brand.foreground        // text on brand color

// borders
colors.border.default          // standard borders
colors.border.muted            // subtle borders
colors.border.focus            // focus rings

// status
colors.success.default         // success states
colors.warning.default         // warning states
colors.error.default           // error states
colors.info.default            // info states

// each status has: default, hover, active, subtle, muted, emphasis, foreground, border
```

### spacing

4px base grid, following tailwind scale.

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

### typography

font sizes with paired line heights.

```tsx
const { typography } = useTheme().theme

// scale (fontSize, lineHeight, letterSpacing)
typography.scale.xs      // { fontSize: 12, lineHeight: 16, letterSpacing: 0.4 }
typography.scale.sm      // { fontSize: 14, lineHeight: 20, letterSpacing: 0.25 }
typography.scale.base    // { fontSize: 16, lineHeight: 24, letterSpacing: 0 }
typography.scale.lg      // { fontSize: 18, lineHeight: 28, letterSpacing: 0 }
typography.scale.xl      // { fontSize: 20, lineHeight: 28, letterSpacing: 0 }
typography.scale["2xl"]  // { fontSize: 24, lineHeight: 32, letterSpacing: 0 }
typography.scale["3xl"]  // { fontSize: 30, lineHeight: 36, letterSpacing: 0 }

// weights
typography.weights.normal    // "400"
typography.weights.medium    // "500"
typography.weights.semibold  // "600"
typography.weights.bold      // "700"

// families
typography.families.sans     // "System"
typography.families.mono     // "Menlo"
```

### radius

border radius scale.

```tsx
const { radius } = useTheme().theme

radius.none   // 0
radius.sm     // 4
radius.md     // 8
radius.lg     // 12
radius.xl     // 16
radius.full   // 9999
```

### shadows

elevation/shadow definitions for react native.

```tsx
const { shadows } = useTheme().theme

shadows.none  // no shadow
shadows.sm    // subtle shadow
shadows.md    // medium shadow
shadows.lg    // large shadow

// each shadow is: { shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation }
```

### sizes

common UI element sizes.

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

## dark mode

### automatic system detection

```tsx
<ThemeProvider defaultMode="system">
  <App />
</ThemeProvider>
```

### manual toggle

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

### set specific mode

```tsx
const { setThemeMode } = useTheme()

setThemeMode("light")   // force light
setThemeMode("dark")    // force dark
setThemeMode("system")  // follow system
```

### persist preference

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

## custom themes

### override default themes

```tsx
import { ThemeProvider, lightTheme, darkTheme } from "@/theme"

const customLight = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    brand: {
      ...lightTheme.colors.brand,
      default: "#FF6B00", // custom brand color
    },
  },
}

<ThemeProvider lightTheme={customLight}>
  <App />
</ThemeProvider>
```

### create theme from scratch

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

## api reference

### ThemeProvider

main provider component.

| prop | type | default | description |
|------|------|---------|-------------|
| defaultMode | `"light" \| "dark" \| "system"` | `"system"` | initial theme mode |
| lightTheme | `Theme` | built-in | custom light theme |
| darkTheme | `Theme` | built-in | custom dark theme |
| onThemeModeChange | `(mode: ThemeMode) => void` | - | callback when mode changes |
| children | `ReactNode` | required | app content |

### useTheme return value

| property | type | description |
|----------|------|-------------|
| theme | `Theme` | current theme object |
| themeMode | `ThemeMode` | current setting (light/dark/system) |
| resolvedMode | `"light" \| "dark"` | actual mode after system resolution |
| isDark | `boolean` | true if dark mode active |
| setThemeMode | `(mode: ThemeMode) => void` | set theme mode |
| toggleTheme | `() => void` | toggle between light/dark |

## module structure

```
theme/
├── index.ts          # barrel exports
├── types.ts          # typescript interfaces
├── primitives.ts     # raw token values
├── context.tsx       # ThemeProvider, context
├── hooks.ts          # useTheme, useThemedStyles, etc.
├── themes/
│   ├── light.ts      # light theme
│   └── dark.ts       # dark theme
└── readme.md         # this file
```

## color scale reference

primitives use 12-step color scales (radix convention):

| step | use case |
|------|----------|
| 1-2 | backgrounds |
| 3-5 | component backgrounds (normal, hover, active) |
| 6-8 | borders (subtle, normal, strong) |
| 9-10 | solid backgrounds (normal, hover) |
| 11-12 | text (low contrast, high contrast) |
