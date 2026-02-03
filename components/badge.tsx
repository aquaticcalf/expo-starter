/**
 * Badge Component
 *
 * Status indicator with color schemes and variants.
 */

import { memo } from "react"
import { View, StyleSheet } from "react-native"
import { useThemeValue } from "@/theme"
import { Text } from "./text"

// =============================================================================
// TYPES
// =============================================================================

type BadgeColorScheme = "brand" | "success" | "warning" | "error" | "info" | "neutral"
type BadgeSize = "sm" | "md" | "lg"
type BadgeVariant = "solid" | "subtle" | "outline"

export type BadgeProps = {
  colorScheme?: BadgeColorScheme
  size?: BadgeSize
  variant?: BadgeVariant
  children: React.ReactNode
}

// =============================================================================
// SIZE CONFIGURATION
// =============================================================================

type SizeConfig = {
  paddingHorizontal: number
  paddingVertical: number
  fontSize: "caption" | "label-small" | "label"
}

const sizeConfig: Record<BadgeSize, SizeConfig> = {
  sm: { paddingHorizontal: 6, paddingVertical: 2, fontSize: "caption" },
  md: { paddingHorizontal: 8, paddingVertical: 3, fontSize: "label-small" },
  lg: { paddingHorizontal: 10, paddingVertical: 4, fontSize: "label" },
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Badge = memo(function Badge({
  colorScheme = "brand",
  size = "md",
  variant = "subtle",
  children,
}: BadgeProps) {
  const theme = useThemeValue()
  const config = sizeConfig[size]

  // Get colors based on variant and color scheme
  const colors = getBadgeColors(variant, colorScheme, theme)

  const badgeStyle = {
    paddingHorizontal: config.paddingHorizontal,
    paddingVertical: config.paddingVertical,
    borderRadius: theme.radius.sm,
    backgroundColor: colors.background,
    borderWidth: variant === "outline" ? 1 : 0,
    borderColor: colors.border,
  }

  return (
    <View style={[styles.badge, badgeStyle]}>
      <Text variant={config.fontSize} weight="medium" color={getTextColor(variant, colorScheme)}>
        {children}
      </Text>
    </View>
  )
})

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
  },
})

// =============================================================================
// HELPERS
// =============================================================================

type BadgeColors = {
  background: string | undefined
  border: string | undefined
}

function getBadgeColors(
  variant: BadgeVariant,
  colorScheme: BadgeColorScheme,
  theme: ReturnType<typeof useThemeValue>,
): BadgeColors {
  // Handle neutral separately
  if (colorScheme === "neutral") {
    const schemeColors = {
      solid: theme.colors.background.inverse,
      subtle: theme.colors.background.muted,
      border: theme.colors.border.default,
    }

    switch (variant) {
      case "solid":
        return { background: schemeColors.solid, border: undefined }
      case "subtle":
        return { background: schemeColors.subtle, border: undefined }
      case "outline":
        return { background: undefined, border: schemeColors.border }
    }
  }

  // Handle brand separately (no border property)
  if (colorScheme === "brand") {
    const schemeColors = {
      solid: theme.colors.brand.default,
      subtle: theme.colors.brand.subtle,
      border: theme.colors.border.focus, // Use focus color for brand outline
    }

    switch (variant) {
      case "solid":
        return { background: schemeColors.solid, border: undefined }
      case "subtle":
        return { background: schemeColors.subtle, border: undefined }
      case "outline":
        return { background: undefined, border: schemeColors.border }
    }
  }

  // Status colors (success, warning, error, info) have border property
  const statusColors = theme.colors[colorScheme]
  const schemeColors = {
    solid: statusColors.default,
    subtle: statusColors.subtle,
    border: statusColors.border,
  }

  switch (variant) {
    case "solid":
      return { background: schemeColors.solid, border: undefined }
    case "subtle":
      return { background: schemeColors.subtle, border: undefined }
    case "outline":
      return { background: undefined, border: schemeColors.border }
  }
}

function getTextColor(
  variant: BadgeVariant,
  colorScheme: BadgeColorScheme,
): "default" | "inverse" | "brand" | "error" | "success" | "warning" | "info" {
  if (variant === "solid") return colorScheme === "neutral" ? "inverse" : "inverse"
  if (colorScheme === "neutral") return "default"
  return colorScheme
}
