/**
 * Primitive Design Tokens
 *
 * Raw values that form the foundation of the design system.
 * These values should NEVER be used directly in components.
 * Use semantic tokens from themes instead.
 *
 * Color scales follow Radix UI 12-step convention:
 * 1-2: Backgrounds | 3-5: Component states | 6-8: Borders | 9-10: Solid | 11-12: Text
 */

import type {
  ColorScale,
  AlphaColorScale,
  SpacingScale,
  TypeScale,
  FontWeightScale,
  FontFamilyScale,
  RadiusScale,
  ShadowScale,
  ZIndexScale,
  DurationScale,
  OpacityScale,
  SizeScale,
  Primitives,
} from "./types"

// =============================================================================
// COLOR PRIMITIVES
// =============================================================================

/**
 * Neutral gray scale - Light mode
 */
export const grayLight: ColorScale = {
  1: "#fcfcfc",
  2: "#f9f9f9",
  3: "#f0f0f0",
  4: "#e8e8e8",
  5: "#e0e0e0",
  6: "#d9d9d9",
  7: "#cecece",
  8: "#bbbbbb",
  9: "#8d8d8d",
  10: "#838383",
  11: "#646464",
  12: "#202020",
}

/**
 * Neutral gray scale - Dark mode
 */
export const grayDark: ColorScale = {
  1: "#111111",
  2: "#191919",
  3: "#222222",
  4: "#2a2a2a",
  5: "#313131",
  6: "#3a3a3a",
  7: "#484848",
  8: "#606060",
  9: "#6e6e6e",
  10: "#7b7b7b",
  11: "#b4b4b4",
  12: "#eeeeee",
}

/**
 * Gray alpha scale - Light mode
 */
export const grayAlphaLight: AlphaColorScale = {
  1: "rgba(0, 0, 0, 0.01)",
  2: "rgba(0, 0, 0, 0.02)",
  3: "rgba(0, 0, 0, 0.05)",
  4: "rgba(0, 0, 0, 0.08)",
  5: "rgba(0, 0, 0, 0.11)",
  6: "rgba(0, 0, 0, 0.14)",
  7: "rgba(0, 0, 0, 0.18)",
  8: "rgba(0, 0, 0, 0.26)",
  9: "rgba(0, 0, 0, 0.44)",
  10: "rgba(0, 0, 0, 0.48)",
  11: "rgba(0, 0, 0, 0.60)",
  12: "rgba(0, 0, 0, 0.87)",
}

/**
 * Gray alpha scale - Dark mode
 */
export const grayAlphaDark: AlphaColorScale = {
  1: "rgba(255, 255, 255, 0.01)",
  2: "rgba(255, 255, 255, 0.03)",
  3: "rgba(255, 255, 255, 0.06)",
  4: "rgba(255, 255, 255, 0.09)",
  5: "rgba(255, 255, 255, 0.12)",
  6: "rgba(255, 255, 255, 0.15)",
  7: "rgba(255, 255, 255, 0.20)",
  8: "rgba(255, 255, 255, 0.30)",
  9: "rgba(255, 255, 255, 0.36)",
  10: "rgba(255, 255, 255, 0.42)",
  11: "rgba(255, 255, 255, 0.68)",
  12: "rgba(255, 255, 255, 0.92)",
}

/**
 * Brand/Primary color scale - Light mode (Blue-based, customize as needed)
 */
export const brandLight: ColorScale = {
  1: "#fbfdff",
  2: "#f4faff",
  3: "#e6f4fe",
  4: "#d5efff",
  5: "#c2e5ff",
  6: "#acd8fc",
  7: "#8ec8f6",
  8: "#5eb1ef",
  9: "#0090ff",
  10: "#0588f0",
  11: "#0d74ce",
  12: "#113264",
}

/**
 * Brand/Primary color scale - Dark mode
 */
export const brandDark: ColorScale = {
  1: "#0d1520",
  2: "#111927",
  3: "#0d2847",
  4: "#003362",
  5: "#004074",
  6: "#104d87",
  7: "#205d9e",
  8: "#2870bd",
  9: "#0090ff",
  10: "#3b9eff",
  11: "#70b8ff",
  12: "#c2e6ff",
}

/**
 * Brand alpha scale - Light mode
 */
export const brandAlphaLight: AlphaColorScale = {
  1: "rgba(0, 144, 255, 0.02)",
  2: "rgba(0, 144, 255, 0.04)",
  3: "rgba(0, 144, 255, 0.10)",
  4: "rgba(0, 144, 255, 0.17)",
  5: "rgba(0, 144, 255, 0.24)",
  6: "rgba(0, 144, 255, 0.33)",
  7: "rgba(0, 144, 255, 0.44)",
  8: "rgba(0, 144, 255, 0.63)",
  9: "rgba(0, 144, 255, 1.00)",
  10: "rgba(0, 136, 240, 0.98)",
  11: "rgba(0, 100, 182, 0.95)",
  12: "rgba(0, 37, 77, 0.93)",
}

/**
 * Brand alpha scale - Dark mode
 */
export const brandAlphaDark: AlphaColorScale = {
  1: "rgba(0, 144, 255, 0.05)",
  2: "rgba(0, 144, 255, 0.09)",
  3: "rgba(0, 144, 255, 0.22)",
  4: "rgba(0, 144, 255, 0.34)",
  5: "rgba(0, 144, 255, 0.42)",
  6: "rgba(0, 144, 255, 0.50)",
  7: "rgba(0, 144, 255, 0.60)",
  8: "rgba(0, 144, 255, 0.72)",
  9: "rgba(0, 144, 255, 1.00)",
  10: "rgba(59, 158, 255, 1.00)",
  11: "rgba(112, 184, 255, 1.00)",
  12: "rgba(194, 230, 255, 1.00)",
}

/**
 * Red/Error scale - Light mode
 */
export const redLight: ColorScale = {
  1: "#fffcfc",
  2: "#fff7f7",
  3: "#feebec",
  4: "#ffdbdc",
  5: "#ffcdce",
  6: "#fdbdbe",
  7: "#f4a9aa",
  8: "#eb8e90",
  9: "#e5484d",
  10: "#dc3e42",
  11: "#ce2c31",
  12: "#641723",
}

/**
 * Red/Error scale - Dark mode
 */
export const redDark: ColorScale = {
  1: "#191111",
  2: "#201314",
  3: "#3b1219",
  4: "#500f1c",
  5: "#611623",
  6: "#72232d",
  7: "#8c333a",
  8: "#b54548",
  9: "#e5484d",
  10: "#ec5d5e",
  11: "#ff9592",
  12: "#ffd1d9",
}

/**
 * Red alpha scale - Light mode
 */
export const redAlphaLight: AlphaColorScale = {
  1: "rgba(255, 0, 0, 0.01)",
  2: "rgba(255, 0, 0, 0.03)",
  3: "rgba(255, 0, 0, 0.08)",
  4: "rgba(255, 0, 0, 0.14)",
  5: "rgba(255, 0, 0, 0.20)",
  6: "rgba(255, 0, 0, 0.26)",
  7: "rgba(255, 0, 0, 0.34)",
  8: "rgba(255, 0, 0, 0.44)",
  9: "rgba(229, 72, 77, 1.00)",
  10: "rgba(220, 62, 66, 1.00)",
  11: "rgba(206, 44, 49, 1.00)",
  12: "rgba(100, 23, 35, 1.00)",
}

/**
 * Red alpha scale - Dark mode
 */
export const redAlphaDark: AlphaColorScale = {
  1: "rgba(255, 0, 0, 0.04)",
  2: "rgba(255, 0, 0, 0.07)",
  3: "rgba(255, 0, 0, 0.18)",
  4: "rgba(255, 0, 0, 0.27)",
  5: "rgba(255, 0, 0, 0.34)",
  6: "rgba(255, 0, 0, 0.41)",
  7: "rgba(255, 0, 0, 0.52)",
  8: "rgba(255, 0, 0, 0.69)",
  9: "rgba(229, 72, 77, 1.00)",
  10: "rgba(236, 93, 94, 1.00)",
  11: "rgba(255, 149, 146, 1.00)",
  12: "rgba(255, 209, 217, 1.00)",
}

/**
 * Orange/Warning scale - Light mode
 */
export const orangeLight: ColorScale = {
  1: "#fefcfb",
  2: "#fff7ed",
  3: "#ffefd6",
  4: "#ffdfb5",
  5: "#ffd19a",
  6: "#ffc182",
  7: "#f5ae73",
  8: "#ec9455",
  9: "#f76b15",
  10: "#ef5f00",
  11: "#cc4e00",
  12: "#582d1d",
}

/**
 * Orange/Warning scale - Dark mode
 */
export const orangeDark: ColorScale = {
  1: "#17120e",
  2: "#1e160f",
  3: "#331e0b",
  4: "#462100",
  5: "#562800",
  6: "#66350c",
  7: "#7e451d",
  8: "#a35829",
  9: "#f76b15",
  10: "#ff801f",
  11: "#ffa057",
  12: "#ffe0c2",
}

/**
 * Orange alpha scale - Light mode
 */
export const orangeAlphaLight: AlphaColorScale = {
  1: "rgba(192, 64, 0, 0.01)",
  2: "rgba(255, 128, 0, 0.07)",
  3: "rgba(255, 160, 0, 0.16)",
  4: "rgba(255, 150, 0, 0.29)",
  5: "rgba(255, 145, 0, 0.40)",
  6: "rgba(255, 135, 0, 0.49)",
  7: "rgba(235, 115, 0, 0.55)",
  8: "rgba(225, 105, 0, 0.67)",
  9: "rgba(247, 107, 21, 1.00)",
  10: "rgba(239, 95, 0, 1.00)",
  11: "rgba(204, 78, 0, 1.00)",
  12: "rgba(88, 45, 29, 1.00)",
}

/**
 * Orange alpha scale - Dark mode
 */
export const orangeAlphaDark: AlphaColorScale = {
  1: "rgba(255, 64, 0, 0.03)",
  2: "rgba(255, 128, 0, 0.07)",
  3: "rgba(255, 128, 0, 0.16)",
  4: "rgba(255, 128, 0, 0.24)",
  5: "rgba(255, 128, 0, 0.31)",
  6: "rgba(255, 128, 0, 0.38)",
  7: "rgba(255, 128, 0, 0.48)",
  8: "rgba(255, 128, 0, 0.62)",
  9: "rgba(247, 107, 21, 1.00)",
  10: "rgba(255, 128, 31, 1.00)",
  11: "rgba(255, 160, 87, 1.00)",
  12: "rgba(255, 224, 194, 1.00)",
}

/**
 * Yellow scale - Light mode
 */
export const yellowLight: ColorScale = {
  1: "#fdfdf9",
  2: "#fefce9",
  3: "#fffab8",
  4: "#fff394",
  5: "#ffe770",
  6: "#f3d768",
  7: "#e4c767",
  8: "#d5ae39",
  9: "#ffe629",
  10: "#ffdc00",
  11: "#9e6c00",
  12: "#473b1f",
}

/**
 * Yellow scale - Dark mode
 */
export const yellowDark: ColorScale = {
  1: "#14120b",
  2: "#1b180f",
  3: "#2d2305",
  4: "#362b00",
  5: "#433500",
  6: "#524202",
  7: "#665417",
  8: "#836a21",
  9: "#ffe629",
  10: "#ffff57",
  11: "#f5e147",
  12: "#f6eeb4",
}

/**
 * Yellow alpha scale - Light mode
 */
export const yellowAlphaLight: AlphaColorScale = {
  1: "rgba(128, 128, 0, 0.02)",
  2: "rgba(255, 224, 0, 0.09)",
  3: "rgba(255, 230, 0, 0.28)",
  4: "rgba(255, 220, 0, 0.42)",
  5: "rgba(255, 210, 0, 0.56)",
  6: "rgba(225, 180, 0, 0.59)",
  7: "rgba(200, 155, 0, 0.60)",
  8: "rgba(185, 135, 0, 0.78)",
  9: "rgba(255, 230, 41, 1.00)",
  10: "rgba(255, 220, 0, 1.00)",
  11: "rgba(158, 108, 0, 1.00)",
  12: "rgba(71, 59, 31, 1.00)",
}

/**
 * Yellow alpha scale - Dark mode
 */
export const yellowAlphaDark: AlphaColorScale = {
  1: "rgba(192, 128, 0, 0.03)",
  2: "rgba(255, 192, 0, 0.06)",
  3: "rgba(255, 192, 0, 0.14)",
  4: "rgba(255, 192, 0, 0.19)",
  5: "rgba(255, 192, 0, 0.25)",
  6: "rgba(255, 200, 0, 0.31)",
  7: "rgba(255, 200, 0, 0.39)",
  8: "rgba(255, 200, 0, 0.51)",
  9: "rgba(255, 230, 41, 1.00)",
  10: "rgba(255, 255, 87, 1.00)",
  11: "rgba(245, 225, 71, 1.00)",
  12: "rgba(246, 238, 180, 1.00)",
}

/**
 * Green/Success scale - Light mode
 */
export const greenLight: ColorScale = {
  1: "#fbfefc",
  2: "#f4fbf6",
  3: "#e6f6eb",
  4: "#d6f1df",
  5: "#c4e8d1",
  6: "#adddc0",
  7: "#8eceaa",
  8: "#5bb98b",
  9: "#30a46c",
  10: "#2b9a66",
  11: "#218358",
  12: "#193b2d",
}

/**
 * Green/Success scale - Dark mode
 */
export const greenDark: ColorScale = {
  1: "#0e1512",
  2: "#121b17",
  3: "#132d21",
  4: "#113b29",
  5: "#174933",
  6: "#20573e",
  7: "#28684a",
  8: "#2f7c57",
  9: "#30a46c",
  10: "#33b074",
  11: "#3dd68c",
  12: "#b1f1cb",
}

/**
 * Green alpha scale - Light mode
 */
export const greenAlphaLight: AlphaColorScale = {
  1: "rgba(0, 192, 64, 0.02)",
  2: "rgba(0, 168, 56, 0.04)",
  3: "rgba(0, 176, 56, 0.10)",
  4: "rgba(0, 172, 52, 0.16)",
  5: "rgba(0, 164, 52, 0.23)",
  6: "rgba(0, 156, 52, 0.32)",
  7: "rgba(0, 148, 52, 0.44)",
  8: "rgba(0, 144, 56, 0.64)",
  9: "rgba(0, 140, 68, 0.81)",
  10: "rgba(0, 132, 64, 0.83)",
  11: "rgba(0, 112, 56, 0.87)",
  12: "rgba(0, 40, 24, 0.90)",
}

/**
 * Green alpha scale - Dark mode
 */
export const greenAlphaDark: AlphaColorScale = {
  1: "rgba(0, 224, 64, 0.03)",
  2: "rgba(0, 224, 96, 0.06)",
  3: "rgba(0, 224, 96, 0.14)",
  4: "rgba(0, 224, 104, 0.20)",
  5: "rgba(0, 224, 104, 0.27)",
  6: "rgba(0, 224, 112, 0.33)",
  7: "rgba(0, 224, 112, 0.40)",
  8: "rgba(0, 224, 116, 0.48)",
  9: "rgba(48, 164, 108, 1.00)",
  10: "rgba(51, 176, 116, 1.00)",
  11: "rgba(61, 214, 140, 1.00)",
  12: "rgba(177, 241, 203, 1.00)",
}

/**
 * Blue/Info scale - Light mode
 */
export const blueLight: ColorScale = {
  1: "#fbfdff",
  2: "#f4faff",
  3: "#e6f4fe",
  4: "#d5efff",
  5: "#c2e5ff",
  6: "#acd8fc",
  7: "#8ec8f6",
  8: "#5eb1ef",
  9: "#0090ff",
  10: "#0588f0",
  11: "#0d74ce",
  12: "#113264",
}

/**
 * Blue/Info scale - Dark mode
 */
export const blueDark: ColorScale = {
  1: "#0d1520",
  2: "#111927",
  3: "#0d2847",
  4: "#003362",
  5: "#004074",
  6: "#104d87",
  7: "#205d9e",
  8: "#2870bd",
  9: "#0090ff",
  10: "#3b9eff",
  11: "#70b8ff",
  12: "#c2e6ff",
}

/**
 * Blue alpha scale - Light mode
 */
export const blueAlphaLight: AlphaColorScale = {
  1: "rgba(0, 144, 255, 0.02)",
  2: "rgba(0, 144, 255, 0.04)",
  3: "rgba(0, 144, 255, 0.10)",
  4: "rgba(0, 144, 255, 0.17)",
  5: "rgba(0, 144, 255, 0.24)",
  6: "rgba(0, 144, 255, 0.33)",
  7: "rgba(0, 144, 255, 0.44)",
  8: "rgba(0, 144, 255, 0.63)",
  9: "rgba(0, 144, 255, 1.00)",
  10: "rgba(0, 136, 240, 0.98)",
  11: "rgba(0, 100, 182, 0.95)",
  12: "rgba(0, 37, 77, 0.93)",
}

/**
 * Blue alpha scale - Dark mode
 */
export const blueAlphaDark: AlphaColorScale = {
  1: "rgba(0, 144, 255, 0.05)",
  2: "rgba(0, 144, 255, 0.09)",
  3: "rgba(0, 144, 255, 0.22)",
  4: "rgba(0, 144, 255, 0.34)",
  5: "rgba(0, 144, 255, 0.42)",
  6: "rgba(0, 144, 255, 0.50)",
  7: "rgba(0, 144, 255, 0.60)",
  8: "rgba(0, 144, 255, 0.72)",
  9: "rgba(0, 144, 255, 1.00)",
  10: "rgba(59, 158, 255, 1.00)",
  11: "rgba(112, 184, 255, 1.00)",
  12: "rgba(194, 230, 255, 1.00)",
}

// =============================================================================
// SPACING PRIMITIVES (4px base grid)
// =============================================================================

export const spacing: SpacingScale = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
}

// =============================================================================
// TYPOGRAPHY PRIMITIVES
// =============================================================================

export const typeScale: TypeScale = {
  xs: { fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
  sm: { fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
  base: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  lg: { fontSize: 18, lineHeight: 28, letterSpacing: 0 },
  xl: { fontSize: 20, lineHeight: 28, letterSpacing: 0 },
  "2xl": { fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  "3xl": { fontSize: 30, lineHeight: 36, letterSpacing: 0 },
  "4xl": { fontSize: 36, lineHeight: 40, letterSpacing: -0.5 },
  "5xl": { fontSize: 48, lineHeight: 48, letterSpacing: -0.5 },
  "6xl": { fontSize: 60, lineHeight: 60, letterSpacing: -1 },
}

export const fontWeights: FontWeightScale = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
}

export const fontFamilies: FontFamilyScale = {
  sans: "System",
  serif: "Georgia",
  mono: "Menlo",
}

// =============================================================================
// RADIUS PRIMITIVES (Material Design 3 aligned)
// =============================================================================

export const radius: RadiusScale = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  "3xl": 28,
  full: 9999,
}

// =============================================================================
// SHADOW PRIMITIVES
// =============================================================================

export const shadowsLight: ShadowScale = {
  none: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 12,
  },
  "2xl": {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.15,
    shadowRadius: 50,
    elevation: 16,
  },
}

export const shadowsDark: ShadowScale = {
  none: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 12,
  },
  "2xl": {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 16,
  },
}

// =============================================================================
// Z-INDEX PRIMITIVES
// =============================================================================

export const zIndex: ZIndexScale = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
}

// =============================================================================
// DURATION PRIMITIVES
// All values are in milliseconds. Named semantically by perceived speed.
// =============================================================================

export const duration: DurationScale = {
  instant: 0, // No animation.
  fast: 100, // Micro-interactions (hover, press feedback).
  normal: 200, // Standard transitions (fade in/out).
  slow: 300, // Deliberate animations (modal, drawer).
  slower: 500, // Emphasized transitions.
  slowest: 1000, // Long-form animations (skeleton, progress).
}

// =============================================================================
// OPACITY PRIMITIVES
// =============================================================================

export const opacity: OpacityScale = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  25: 0.25,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  75: 0.75,
  80: 0.8,
  90: 0.9,
  95: 0.95,
  100: 1,
}

// =============================================================================
// SIZE PRIMITIVES
// =============================================================================

export const sizes: SizeScale = {
  touchTarget: 44, // Apple HIG minimum
  iconXs: 12,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 32,
  inputSm: 32,
  inputMd: 40,
  inputLg: 48,
  buttonSm: 32,
  buttonMd: 40,
  buttonLg: 48,
  avatarXs: 24,
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 56,
  avatarXl: 80,
}

// =============================================================================
// COMBINED PRIMITIVES EXPORT
// =============================================================================

export const primitivesLight: Primitives = {
  colors: {
    gray: grayLight,
    grayAlpha: grayAlphaLight,
    brand: brandLight,
    brandAlpha: brandAlphaLight,
    red: redLight,
    redAlpha: redAlphaLight,
    orange: orangeLight,
    orangeAlpha: orangeAlphaLight,
    yellow: yellowLight,
    yellowAlpha: yellowAlphaLight,
    green: greenLight,
    greenAlpha: greenAlphaLight,
    blue: blueLight,
    blueAlpha: blueAlphaLight,
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
  },
  spacing,
  typography: {
    scale: typeScale,
    weights: fontWeights,
    families: fontFamilies,
  },
  radius,
  shadows: shadowsLight,
  zIndex,
  duration,
  opacity,
  sizes,
}

export const primitivesDark: Primitives = {
  colors: {
    gray: grayDark,
    grayAlpha: grayAlphaDark,
    brand: brandDark,
    brandAlpha: brandAlphaDark,
    red: redDark,
    redAlpha: redAlphaDark,
    orange: orangeDark,
    orangeAlpha: orangeAlphaDark,
    yellow: yellowDark,
    yellowAlpha: yellowAlphaDark,
    green: greenDark,
    greenAlpha: greenAlphaDark,
    blue: blueDark,
    blueAlpha: blueAlphaDark,
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
  },
  spacing,
  typography: {
    scale: typeScale,
    weights: fontWeights,
    families: fontFamilies,
  },
  radius,
  shadows: shadowsDark,
  zIndex,
  duration,
  opacity,
  sizes,
}
