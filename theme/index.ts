/**
 * Theme System
 *
 * A production-grade, three-tier design token architecture:
 *
 * 1. Primitives - Raw values (colors, spacing, etc.) - never used directly
 * 2. Semantic tokens - Meaning-based tokens (background.surface, foreground.muted)
 * 3. Theme - Complete token set with all semantic mappings
 *
 * @example
 * ```tsx
 * // In your app entry point
 * import { ThemeProvider } from "@/theme"
 *
 * export default function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   )
 * }
 *
 * // In components
 * import { useTheme, useThemedStyles } from "@/theme"
 *
 * function MyComponent() {
 *   const { theme, isDark, toggleTheme } = useTheme()
 *
 *   const styles = useThemedStyles((t) => ({
 *     container: {
 *       backgroundColor: t.colors.background.surface,
 *       padding: t.spacing[4],
 *       borderRadius: t.radius.md,
 *     },
 *     text: {
 *       color: t.colors.foreground.default,
 *       ...t.typography.scale.base,
 *     },
 *   }))
 *
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.text}>Hello</Text>
 *     </View>
 *   )
 * }
 * ```
 */

// Context & Provider
export { ThemeProvider, ThemeContext, themes } from "./context"
export type { ThemeContextValue, ThemeProviderProps } from "./context"

// Hooks
export {
  useTheme,
  useThemeValue,
  useColors,
  useSpacing,
  useTypography,
  useRadius,
  useShadows,
  useIsDark,
  useThemedStyles,
  createThemedStyleSheet,
} from "./hooks"

// Themes
export { lightTheme } from "./themes/light"
export { darkTheme } from "./themes/dark"

// Primitives (for advanced use cases / custom themes)
export {
  // Light mode primitives
  grayLight,
  brandLight,
  redLight,
  orangeLight,
  yellowLight,
  greenLight,
  blueLight,
  grayAlphaLight,
  brandAlphaLight,
  redAlphaLight,
  orangeAlphaLight,
  yellowAlphaLight,
  greenAlphaLight,
  blueAlphaLight,
  // Dark mode primitives
  grayDark,
  brandDark,
  redDark,
  orangeDark,
  yellowDark,
  greenDark,
  blueDark,
  grayAlphaDark,
  brandAlphaDark,
  redAlphaDark,
  orangeAlphaDark,
  yellowAlphaDark,
  greenAlphaDark,
  blueAlphaDark,
  // Shared primitives
  spacing,
  typeScale,
  fontWeights,
  fontFamilies,
  radius,
  shadowsLight,
  shadowsDark,
  zIndex,
  duration,
  opacity,
  sizes,
  // Combined primitive objects
  primitivesLight,
  primitivesDark,
} from "./primitives"

// Types
export type {
  // Core types
  Theme,
  ThemeMode,
  Primitives,
  SemanticColors,
  SemanticTokens,
  // Color types
  ColorScale,
  AlphaColorScale,
  PrimitiveColors,
  // Scale types
  SpacingScale,
  TypeScale,
  TypeScaleEntry,
  FontWeightScale,
  FontFamilyScale,
  RadiusScale,
  ShadowScale,
  ShadowDefinition,
  ZIndexScale,
  DurationScale,
  OpacityScale,
  SizeScale,
  // Token key types (for type-safe access)
  ColorToken,
  SpacingToken,
  RadiusToken,
  ShadowToken,
  TypeScaleToken,
  FontWeightToken,
  FontFamilyToken,
  ZIndexToken,
  DurationToken,
  OpacityToken,
  SizeToken,
} from "./types"
