/**
 * Text Component
 *
 * Typography primitive with semantic variants and theme integration.
 * Provides consistent text styling across the app through variant-based
 * configuration rather than manual font size and weight specification.
 */

import { memo } from "react"
import { Text as RNText, type TextProps as RNTextProps } from "react-native"
import { useThemeValue } from "@/theme"

// =============================================================================
// TYPES
// =============================================================================

type TextVariant =
  | "body"
  | "body-small"
  | "body-large"
  | "label"
  | "label-small"
  | "label-large"
  | "title"
  | "title-small"
  | "title-large"
  | "headline"
  | "caption"

type TextColor =
  | "default"
  | "muted"
  | "subtle"
  | "inverse"
  | "brand"
  | "error"
  | "success"
  | "warning"
  | "info"

type TextWeight = "thin" | "light" | "normal" | "medium" | "semibold" | "bold" | "black"

type TextAlign = "left" | "center" | "right"

export type TextProps = Omit<RNTextProps, "style"> & {
  variant?: TextVariant
  color?: TextColor
  weight?: TextWeight
  align?: TextAlign
  style?: RNTextProps["style"]
  children: React.ReactNode
}

// =============================================================================
// VARIANT MAPPINGS
// Mapping from semantic variants to typography scale tokens.
// This indirection allows changing the visual appearance without
// updating every component that uses a variant.
// =============================================================================

const variantToScale: Record<TextVariant, "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"> = {
  caption: "xs",
  "body-small": "sm",
  "label-small": "xs",
  body: "base",
  label: "sm",
  "body-large": "lg",
  "label-large": "base",
  "title-small": "lg",
  title: "xl",
  "title-large": "2xl",
  headline: "3xl",
}

// Default weights per variant to ensure visual hierarchy.
const variantToWeight: Record<TextVariant, TextWeight> = {
  caption: "normal",
  "body-small": "normal",
  body: "normal",
  "body-large": "normal",
  "label-small": "medium",
  label: "medium",
  "label-large": "medium",
  "title-small": "semibold",
  title: "semibold",
  "title-large": "bold",
  headline: "bold",
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Text = memo(function Text({
  variant = "body",
  color = "default",
  weight,
  align,
  style,
  children,
  ...rest
}: TextProps) {
  const theme = useThemeValue()

  // Get typography scale based on variant.
  const scale = variantToScale[variant]
  const typography = theme.typography.scale[scale]

  // Get color from theme.
  const textColor = getTextColor(color, theme)

  // Weight prop overrides variant default for flexibility.
  const fontWeight = theme.typography.weights[weight ?? variantToWeight[variant]]

  return (
    <RNText
      style={[
        {
          fontSize: typography.fontSize,
          lineHeight: typography.lineHeight,
          letterSpacing: typography.letterSpacing,
          fontWeight,
          color: textColor,
          fontFamily: theme.typography.families.sans,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  )
})

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Resolve a semantic color name to an actual color value from the theme.
 * Status colors (error, success, etc.) use the default shade from their scale.
 */
function getTextColor(color: TextColor, theme: ReturnType<typeof useThemeValue>): string {
  switch (color) {
    case "default":
      return theme.colors.foreground.default
    case "muted":
      return theme.colors.foreground.muted
    case "subtle":
      return theme.colors.foreground.subtle
    case "inverse":
      return theme.colors.foreground.inverse
    case "brand":
      return theme.colors.brand.default
    case "error":
      return theme.colors.error.default
    case "success":
      return theme.colors.success.default
    case "warning":
      return theme.colors.warning.default
    case "info":
      return theme.colors.info.default
  }
}
