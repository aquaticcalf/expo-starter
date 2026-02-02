/**
 * Theme System Type Definitions
 *
 * Three-tier token architecture:
 * 1. Primitives - Raw values (colors, numbers) - never used directly
 * 2. Semantic tokens - Meaning-based aliases - used in themes
 * 3. Component tokens - Component-specific overrides (optional)
 */

// =============================================================================
// PRIMITIVE TYPES
// =============================================================================

/**
 * Color scale with 12 steps following Radix UI conventions:
 * 1-2: Backgrounds
 * 3-5: Component backgrounds (normal, hover, active)
 * 6-8: Borders (subtle, normal, strong)
 * 9-10: Solid backgrounds (normal, hover)
 * 11-12: Text (low contrast, high contrast)
 */
export interface ColorScale {
  1: string
  2: string
  3: string
  4: string
  5: string
  6: string
  7: string
  8: string
  9: string
  10: string
  11: string
  12: string
}

/**
 * Alpha color scale for overlays and transparency
 */
export interface AlphaColorScale {
  1: string
  2: string
  3: string
  4: string
  5: string
  6: string
  7: string
  8: string
  9: string
  10: string
  11: string
  12: string
}

/**
 * Primitive color palette - raw color values
 */
export interface PrimitiveColors {
  // Neutrals
  gray: ColorScale
  grayAlpha: AlphaColorScale

  // Brand
  brand: ColorScale
  brandAlpha: AlphaColorScale

  // Semantic
  red: ColorScale
  redAlpha: AlphaColorScale
  orange: ColorScale
  orangeAlpha: AlphaColorScale
  yellow: ColorScale
  yellowAlpha: AlphaColorScale
  green: ColorScale
  greenAlpha: AlphaColorScale
  blue: ColorScale
  blueAlpha: AlphaColorScale

  // Static colors (don't change between themes)
  white: string
  black: string
  transparent: string
}

/**
 * Spacing scale based on 4px grid (Tailwind/Material conventions)
 */
export interface SpacingScale {
  0: number
  px: number
  0.5: number
  1: number
  1.5: number
  2: number
  2.5: number
  3: number
  3.5: number
  4: number
  5: number
  6: number
  7: number
  8: number
  9: number
  10: number
  11: number
  12: number
  14: number
  16: number
  20: number
  24: number
  28: number
  32: number
  36: number
  40: number
  44: number
  48: number
  52: number
  56: number
  60: number
  64: number
  72: number
  80: number
  96: number
}

/**
 * Font size scale with paired line heights
 */
export interface TypeScaleEntry {
  fontSize: number
  lineHeight: number
  letterSpacing: number
}

export interface TypeScale {
  xs: TypeScaleEntry
  sm: TypeScaleEntry
  base: TypeScaleEntry
  lg: TypeScaleEntry
  xl: TypeScaleEntry
  "2xl": TypeScaleEntry
  "3xl": TypeScaleEntry
  "4xl": TypeScaleEntry
  "5xl": TypeScaleEntry
  "6xl": TypeScaleEntry
}

/**
 * Font weight scale
 */
export interface FontWeightScale {
  thin: "100"
  extralight: "200"
  light: "300"
  normal: "400"
  medium: "500"
  semibold: "600"
  bold: "700"
  extrabold: "800"
  black: "900"
}

/**
 * Font family definitions
 */
export interface FontFamilyScale {
  sans: string
  serif: string
  mono: string
}

/**
 * Border radius scale following Material Design 3
 */
export interface RadiusScale {
  none: number
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  "2xl": number
  "3xl": number
  full: number
}

/**
 * Shadow/Elevation definitions
 */
export interface ShadowDefinition {
  shadowColor: string
  shadowOffset: { width: number; height: number }
  shadowOpacity: number
  shadowRadius: number
  elevation: number
}

export interface ShadowScale {
  none: ShadowDefinition
  xs: ShadowDefinition
  sm: ShadowDefinition
  md: ShadowDefinition
  lg: ShadowDefinition
  xl: ShadowDefinition
  "2xl": ShadowDefinition
}

/**
 * Z-index scale for layering
 */
export interface ZIndexScale {
  hide: number
  base: number
  docked: number
  dropdown: number
  sticky: number
  banner: number
  overlay: number
  modal: number
  popover: number
  toast: number
  tooltip: number
}

/**
 * Animation duration scale
 */
export interface DurationScale {
  instant: number
  fast: number
  normal: number
  slow: number
  slower: number
  slowest: number
}

/**
 * Opacity scale
 */
export interface OpacityScale {
  0: number
  5: number
  10: number
  20: number
  25: number
  30: number
  40: number
  50: number
  60: number
  70: number
  75: number
  80: number
  90: number
  95: number
  100: number
}

/**
 * Size tokens for common UI elements
 */
export interface SizeScale {
  touchTarget: number // Minimum 44pt for accessibility
  iconXs: number
  iconSm: number
  iconMd: number
  iconLg: number
  iconXl: number
  inputSm: number
  inputMd: number
  inputLg: number
  buttonSm: number
  buttonMd: number
  buttonLg: number
  avatarXs: number
  avatarSm: number
  avatarMd: number
  avatarLg: number
  avatarXl: number
}

// =============================================================================
// PRIMITIVE TOKENS (Complete raw value set)
// =============================================================================

export interface Primitives {
  colors: PrimitiveColors
  spacing: SpacingScale
  typography: {
    scale: TypeScale
    weights: FontWeightScale
    families: FontFamilyScale
  }
  radius: RadiusScale
  shadows: ShadowScale
  zIndex: ZIndexScale
  duration: DurationScale
  opacity: OpacityScale
  sizes: SizeScale
}

// =============================================================================
// SEMANTIC TOKENS (Theme-specific mappings)
// =============================================================================

/**
 * Semantic color tokens - what colors mean in context
 */
export interface SemanticColors {
  // Backgrounds
  background: {
    app: string
    subtle: string
    surface: string
    surfaceHover: string
    surfaceActive: string
    elevated: string
    muted: string
    inverse: string
  }

  // Foreground/Text
  foreground: {
    default: string
    muted: string
    subtle: string
    inverse: string
    disabled: string
  }

  // Brand
  brand: {
    default: string
    hover: string
    active: string
    subtle: string
    subtleHover: string
    subtleActive: string
    muted: string
    emphasis: string
    foreground: string
    foregroundMuted: string
  }

  // Borders
  border: {
    default: string
    muted: string
    subtle: string
    emphasis: string
    disabled: string
    inverse: string
    focus: string
  }

  // Status colors
  success: {
    default: string
    hover: string
    active: string
    subtle: string
    subtleHover: string
    subtleActive: string
    muted: string
    emphasis: string
    foreground: string
    border: string
  }

  warning: {
    default: string
    hover: string
    active: string
    subtle: string
    subtleHover: string
    subtleActive: string
    muted: string
    emphasis: string
    foreground: string
    border: string
  }

  error: {
    default: string
    hover: string
    active: string
    subtle: string
    subtleHover: string
    subtleActive: string
    muted: string
    emphasis: string
    foreground: string
    border: string
  }

  info: {
    default: string
    hover: string
    active: string
    subtle: string
    subtleHover: string
    subtleActive: string
    muted: string
    emphasis: string
    foreground: string
    border: string
  }

  // Overlay
  overlay: {
    default: string
    subtle: string
    intense: string
  }
}

/**
 * Complete semantic token set for a theme
 */
export interface SemanticTokens {
  colors: SemanticColors
}

// =============================================================================
// THEME DEFINITION
// =============================================================================

export type ThemeMode = "light" | "dark" | "system"

export interface Theme {
  name: string
  mode: "light" | "dark"
  colors: SemanticColors
  spacing: SpacingScale
  typography: {
    scale: TypeScale
    weights: FontWeightScale
    families: FontFamilyScale
  }
  radius: RadiusScale
  shadows: ShadowScale
  zIndex: ZIndexScale
  duration: DurationScale
  opacity: OpacityScale
  sizes: SizeScale
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Extract all possible token paths for type-safe access
 */
export type ColorToken = keyof SemanticColors
export type SpacingToken = keyof SpacingScale
export type RadiusToken = keyof RadiusScale
export type ShadowToken = keyof ShadowScale
export type TypeScaleToken = keyof TypeScale
export type FontWeightToken = keyof FontWeightScale
export type FontFamilyToken = keyof FontFamilyScale
export type ZIndexToken = keyof ZIndexScale
export type DurationToken = keyof DurationScale
export type OpacityToken = keyof OpacityScale
export type SizeToken = keyof SizeScale
