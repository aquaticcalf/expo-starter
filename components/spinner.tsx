/**
 * Spinner Component
 *
 * Loading indicator with theme-aware colors and sizes.
 */

import { memo } from "react"
import { ActivityIndicator, type ActivityIndicatorProps } from "react-native"
import { useThemeValue } from "@/theme"

// =============================================================================
// TYPES
// =============================================================================

type SpinnerSize = "sm" | "md" | "lg"
type SpinnerColor = "brand" | "foreground" | "inverse" | "success" | "error" | "warning" | "info"

export type SpinnerProps = Omit<ActivityIndicatorProps, "size" | "color"> & {
  size?: SpinnerSize
  color?: SpinnerColor
}

// =============================================================================
// SIZE MAPPING
// =============================================================================

const sizeMap: Record<SpinnerSize, "small" | "large"> = {
  sm: "small",
  md: "small",
  lg: "large",
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Spinner = memo(function Spinner({
  size = "md",
  color = "brand",
  ...rest
}: SpinnerProps) {
  const theme = useThemeValue()

  const spinnerColor = getSpinnerColor(color, theme)

  return <ActivityIndicator size={sizeMap[size]} color={spinnerColor} {...rest} />
})

// =============================================================================
// HELPERS
// =============================================================================

function getSpinnerColor(color: SpinnerColor, theme: ReturnType<typeof useThemeValue>): string {
  switch (color) {
    case "brand":
      return theme.colors.brand.default
    case "foreground":
      return theme.colors.foreground.default
    case "inverse":
      return theme.colors.foreground.inverse
    case "success":
      return theme.colors.success.default
    case "error":
      return theme.colors.error.default
    case "warning":
      return theme.colors.warning.default
    case "info":
      return theme.colors.info.default
  }
}
