/**
 * Box Component
 *
 * Generic View wrapper with theme-aware styling via shorthand props.
 */

import { memo } from "react"
import { View, type ViewProps } from "react-native"
import { useThemeValue } from "@/theme"
import type { SpacingScale, RadiusScale, ShadowScale, SemanticColors } from "@/theme/types"

// =============================================================================
// TYPES
// =============================================================================

type SpacingToken = keyof SpacingScale
type RadiusToken = keyof RadiusScale
type ShadowToken = keyof ShadowScale
type BackgroundToken = keyof SemanticColors["background"]
type BorderColorToken = keyof SemanticColors["border"]

export type BoxProps = ViewProps & {
  // Padding
  p?: SpacingToken | number
  px?: SpacingToken | number
  py?: SpacingToken | number
  pt?: SpacingToken | number
  pb?: SpacingToken | number
  pl?: SpacingToken | number
  pr?: SpacingToken | number

  // Margin
  m?: SpacingToken | number
  mx?: SpacingToken | number
  my?: SpacingToken | number
  mt?: SpacingToken | number
  mb?: SpacingToken | number
  ml?: SpacingToken | number
  mr?: SpacingToken | number

  // Gap
  gap?: SpacingToken | number
  rowGap?: SpacingToken | number
  columnGap?: SpacingToken | number

  // Appearance
  bg?: BackgroundToken
  radius?: RadiusToken
  shadow?: ShadowToken
  borderWidth?: number
  borderColor?: BorderColorToken

  // Layout
  flex?: number
  row?: boolean
  center?: boolean
  children?: React.ReactNode
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Box = memo(function Box({
  // Padding
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  // Margin
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  // Gap
  gap,
  rowGap,
  columnGap,
  // Appearance
  bg,
  radius,
  shadow,
  borderWidth,
  borderColor,
  // Layout
  flex,
  row,
  center,
  // Rest
  style,
  children,
  ...rest
}: BoxProps) {
  const theme = useThemeValue()

  // Resolve spacing values
  const resolveSpacing = (value: SpacingToken | number | undefined): number | undefined => {
    if (value === undefined) return undefined
    if (typeof value === "number") return value
    return theme.spacing[value]
  }

  // Build style object
  const boxStyle = {
    // Padding
    padding: resolveSpacing(p),
    paddingHorizontal: resolveSpacing(px),
    paddingVertical: resolveSpacing(py),
    paddingTop: resolveSpacing(pt),
    paddingBottom: resolveSpacing(pb),
    paddingLeft: resolveSpacing(pl),
    paddingRight: resolveSpacing(pr),
    // Margin
    margin: resolveSpacing(m),
    marginHorizontal: resolveSpacing(mx),
    marginVertical: resolveSpacing(my),
    marginTop: resolveSpacing(mt),
    marginBottom: resolveSpacing(mb),
    marginLeft: resolveSpacing(ml),
    marginRight: resolveSpacing(mr),
    // Gap
    gap: resolveSpacing(gap),
    rowGap: resolveSpacing(rowGap),
    columnGap: resolveSpacing(columnGap),
    // Appearance
    backgroundColor: bg ? theme.colors.background[bg] : undefined,
    borderRadius: radius !== undefined ? theme.radius[radius] : undefined,
    borderWidth,
    borderColor: borderColor ? theme.colors.border[borderColor] : undefined,
    // Shadow
    ...(shadow ? theme.shadows[shadow] : {}),
    // Layout
    flex,
    flexDirection: row ? ("row" as const) : undefined,
    alignItems: center ? ("center" as const) : undefined,
    justifyContent: center ? ("center" as const) : undefined,
  }

  return (
    <View style={[boxStyle, style]} {...rest}>
      {children}
    </View>
  )
})
