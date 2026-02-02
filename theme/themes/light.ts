/**
 * Light Theme
 *
 * Semantic token mappings for light mode.
 * Maps primitive values to meaningful, context-aware tokens.
 */

import type { Theme } from "../types"
import {
  primitivesLight,
  spacing,
  typeScale,
  fontWeights,
  fontFamilies,
  radius,
  shadowsLight,
  zIndex,
  duration,
  opacity,
  sizes,
} from "../primitives"

const p = primitivesLight.colors

export const lightTheme: Theme = {
  name: "light",
  mode: "light",

  colors: {
    // Backgrounds
    background: {
      app: p.gray[1],
      subtle: p.gray[2],
      surface: p.white,
      surfaceHover: p.gray[3],
      surfaceActive: p.gray[4],
      elevated: p.white,
      muted: p.gray[3],
      inverse: p.gray[12],
    },

    // Foreground/Text
    foreground: {
      default: p.gray[12],
      muted: p.gray[11],
      subtle: p.gray[9],
      inverse: p.white,
      disabled: p.gray[8],
    },

    // Brand
    brand: {
      default: p.brand[9],
      hover: p.brand[10],
      active: p.brand[11],
      subtle: p.brand[3],
      subtleHover: p.brand[4],
      subtleActive: p.brand[5],
      muted: p.brand[4],
      emphasis: p.brand[9],
      foreground: p.white,
      foregroundMuted: p.brand[11],
    },

    // Borders
    border: {
      default: p.gray[7],
      muted: p.gray[6],
      subtle: p.gray[4],
      emphasis: p.gray[8],
      disabled: p.gray[5],
      inverse: p.grayAlpha[12],
      focus: p.brand[8],
    },

    // Success
    success: {
      default: p.green[9],
      hover: p.green[10],
      active: p.green[11],
      subtle: p.green[3],
      subtleHover: p.green[4],
      subtleActive: p.green[5],
      muted: p.green[4],
      emphasis: p.green[9],
      foreground: p.white,
      border: p.green[7],
    },

    // Warning
    warning: {
      default: p.orange[9],
      hover: p.orange[10],
      active: p.orange[11],
      subtle: p.orange[3],
      subtleHover: p.orange[4],
      subtleActive: p.orange[5],
      muted: p.orange[4],
      emphasis: p.orange[9],
      foreground: p.white,
      border: p.orange[7],
    },

    // Error
    error: {
      default: p.red[9],
      hover: p.red[10],
      active: p.red[11],
      subtle: p.red[3],
      subtleHover: p.red[4],
      subtleActive: p.red[5],
      muted: p.red[4],
      emphasis: p.red[9],
      foreground: p.white,
      border: p.red[7],
    },

    // Info
    info: {
      default: p.blue[9],
      hover: p.blue[10],
      active: p.blue[11],
      subtle: p.blue[3],
      subtleHover: p.blue[4],
      subtleActive: p.blue[5],
      muted: p.blue[4],
      emphasis: p.blue[9],
      foreground: p.white,
      border: p.blue[7],
    },

    // Overlay
    overlay: {
      default: p.grayAlpha[9],
      subtle: p.grayAlpha[6],
      intense: p.grayAlpha[11],
    },
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
