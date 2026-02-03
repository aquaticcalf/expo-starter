/**
 * Divider Component
 *
 * Separator line with orientation and spacing options.
 */

import { memo } from "react"
import { View } from "react-native"
import { useThemeValue } from "@/theme"
import type { SpacingScale, SemanticColors } from "@/theme/types"

// =============================================================================
// TYPES
// =============================================================================

type SpacingToken = keyof SpacingScale
type DividerOrientation = "horizontal" | "vertical"
type DividerColor = keyof SemanticColors["border"]

export type DividerProps = {
  orientation?: DividerOrientation
  color?: DividerColor
  thickness?: number
  spacing?: SpacingToken | number
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Divider = memo(function Divider({
  orientation = "horizontal",
  color = "muted",
  thickness = 1,
  spacing,
}: DividerProps) {
  const theme = useThemeValue()

  // Resolve spacing
  const resolvedSpacing =
    spacing === undefined ? 0 : typeof spacing === "number" ? spacing : theme.spacing[spacing]

  const isHorizontal = orientation === "horizontal"

  const dividerStyle = {
    backgroundColor: theme.colors.border[color],
    ...(isHorizontal
      ? {
          height: thickness,
          width: "100%" as const,
          marginVertical: resolvedSpacing,
        }
      : {
          width: thickness,
          height: "100%" as const,
          marginHorizontal: resolvedSpacing,
        }),
  }

  return <View style={dividerStyle} />
})
