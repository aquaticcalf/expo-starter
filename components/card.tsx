/**
 * Card Component
 *
 * Surface container with variants for elevated, outlined, and filled styles.
 * Extends Box with card-specific defaults.
 */

import { memo } from "react"
import { View, type ViewProps } from "react-native"
import { useThemeValue } from "@/theme"
import type { SpacingScale, RadiusScale } from "@/theme/types"

// =============================================================================
// TYPES
// =============================================================================

type SpacingToken = keyof SpacingScale
type RadiusToken = keyof RadiusScale
type CardVariant = "elevated" | "outlined" | "filled"

export type CardProps = ViewProps & {
  variant?: CardVariant
  p?: SpacingToken | number
  px?: SpacingToken | number
  py?: SpacingToken | number
  radius?: RadiusToken
  children?: React.ReactNode
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Card = memo(function Card({
  variant = "elevated",
  p = 4,
  px,
  py,
  radius = "lg",
  style,
  children,
  ...rest
}: CardProps) {
  const theme = useThemeValue()

  // Resolve spacing values
  const resolveSpacing = (value: SpacingToken | number | undefined): number | undefined => {
    if (value === undefined) return undefined
    if (typeof value === "number") return value
    return theme.spacing[value]
  }

  // Get variant-specific styles
  const variantStyles = getVariantStyles(variant, theme)

  const cardStyle = {
    padding: resolveSpacing(p),
    paddingHorizontal: resolveSpacing(px),
    paddingVertical: resolveSpacing(py),
    borderRadius: theme.radius[radius],
    ...variantStyles,
  }

  return (
    <View style={[cardStyle, style]} {...rest}>
      {children}
    </View>
  )
})

// =============================================================================
// HELPERS
// =============================================================================

type VariantStyles = {
  backgroundColor: string
  borderWidth?: number
  borderColor?: string
  shadowColor?: string
  shadowOffset?: { width: number; height: number }
  shadowOpacity?: number
  shadowRadius?: number
  elevation?: number
}

function getVariantStyles(
  variant: CardVariant,
  theme: ReturnType<typeof useThemeValue>,
): VariantStyles {
  switch (variant) {
    case "elevated":
      return {
        backgroundColor: theme.colors.background.elevated,
        ...theme.shadows.md,
      }
    case "outlined":
      return {
        backgroundColor: theme.colors.background.surface,
        borderWidth: 1,
        borderColor: theme.colors.border.muted,
      }
    case "filled":
      return {
        backgroundColor: theme.colors.background.muted,
      }
  }
}
