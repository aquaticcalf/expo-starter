/**
 * Icon Component
 *
 * Icon wrapper using Octicons from @expo/vector-icons with theme integration.
 */

import { memo } from "react"
import { Octicons } from "@expo/vector-icons"
import { useThemeValue } from "@/theme"
import type { ComponentProps } from "react"

// =============================================================================
// TYPES
// =============================================================================

type OcticonsGlyphs = ComponentProps<typeof Octicons>["name"]

type IconSize = "xs" | "sm" | "md" | "lg" | "xl"

type IconColor =
  | "default"
  | "muted"
  | "subtle"
  | "inverse"
  | "brand"
  | "error"
  | "success"
  | "warning"
  | "info"

export type IconProps = {
  name: OcticonsGlyphs
  size?: IconSize | number
  color?: IconColor
}

// =============================================================================
// SIZE MAPPING
// =============================================================================

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Icon = memo(function Icon({ name, size = "md", color = "default" }: IconProps) {
  const theme = useThemeValue()

  const iconSize = typeof size === "number" ? size : sizeMap[size]
  const iconColor = getIconColor(color, theme)

  return <Octicons name={name} size={iconSize} color={iconColor} />
})

// =============================================================================
// HELPERS
// =============================================================================

function getIconColor(color: IconColor, theme: ReturnType<typeof useThemeValue>): string {
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
