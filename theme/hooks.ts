/**
 * Theme Hooks
 *
 * Hooks for accessing theme values in components.
 */

import { useContext, useMemo } from "react"
import { StyleSheet } from "react-native"
import { ThemeContext, type ThemeContextValue } from "./context"
import type { Theme } from "./types"

// =============================================================================
// MAIN HOOK
// =============================================================================

/**
 * Access the full theme context
 *
 * @example
 * ```tsx
 * const { theme, isDark, toggleTheme } = useTheme()
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Access just the theme object
 *
 * @example
 * ```tsx
 * const theme = useThemeValue()
 * const color = theme.colors.brand.default
 * ```
 */
export function useThemeValue(): Theme {
  const { theme } = useTheme()
  return theme
}

/**
 * Access theme colors
 *
 * @example
 * ```tsx
 * const colors = useColors()
 * const primary = colors.brand.default
 * ```
 */
export function useColors() {
  const { theme } = useTheme()
  return theme.colors
}

/**
 * Access theme spacing
 *
 * @example
 * ```tsx
 * const spacing = useSpacing()
 * const padding = spacing[4] // 16
 * ```
 */
export function useSpacing() {
  const { theme } = useTheme()
  return theme.spacing
}

/**
 * Access theme typography
 *
 * @example
 * ```tsx
 * const typography = useTypography()
 * const bodyStyle = typography.scale.base
 * ```
 */
export function useTypography() {
  const { theme } = useTheme()
  return theme.typography
}

/**
 * Access theme radius values
 *
 * @example
 * ```tsx
 * const radius = useRadius()
 * const borderRadius = radius.md // 8
 * ```
 */
export function useRadius() {
  const { theme } = useTheme()
  return theme.radius
}

/**
 * Access theme shadows
 *
 * @example
 * ```tsx
 * const shadows = useShadows()
 * const cardShadow = shadows.md
 * ```
 */
export function useShadows() {
  const { theme } = useTheme()
  return theme.shadows
}

/**
 * Check if dark mode is active
 *
 * @example
 * ```tsx
 * const isDark = useIsDark()
 * ```
 */
export function useIsDark(): boolean {
  const { isDark } = useTheme()
  return isDark
}

// =============================================================================
// STYLED HOOK
// =============================================================================

type StyleFactory<T> = (theme: Theme) => T

/**
 * Create themed styles with memoization
 *
 * @example
 * ```tsx
 * const styles = useThemedStyles((theme) => ({
 *   container: {
 *     backgroundColor: theme.colors.background.app,
 *     padding: theme.spacing[4],
 *   },
 *   text: {
 *     color: theme.colors.foreground.default,
 *     fontSize: theme.typography.scale.base.fontSize,
 *   },
 * }))
 * ```
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  styleFactory: StyleFactory<T>,
): T {
  const { theme } = useTheme()

  return useMemo(() => {
    const rawStyles = styleFactory(theme)
    return StyleSheet.create(rawStyles)
  }, [theme, styleFactory])
}

/**
 * Create a style factory that can be used outside of components
 * Returns a hook that provides the themed styles
 *
 * @example
 * ```tsx
 * // styles.ts
 * export const useStyles = createThemedStyleSheet((theme) => ({
 *   container: {
 *     backgroundColor: theme.colors.background.app,
 *   },
 * }))
 *
 * // Component.tsx
 * function Component() {
 *   const styles = useStyles()
 *   return <View style={styles.container} />
 * }
 * ```
 */
export function createThemedStyleSheet<T extends StyleSheet.NamedStyles<T>>(
  styleFactory: StyleFactory<T>,
): () => T {
  return function useStyles(): T {
    return useThemedStyles(styleFactory)
  }
}
