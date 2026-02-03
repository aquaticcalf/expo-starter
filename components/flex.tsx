/**
 * Flex Component
 *
 * Flexbox layout primitive with direction, alignment, and distribution controls.
 * Extends Box with flex-specific props.
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

type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse"
type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline"
type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly"
type FlexWrap = "wrap" | "nowrap" | "wrap-reverse"

export type FlexProps = ViewProps & {
  // Flex-specific
  direction?: FlexDirection
  align?: FlexAlign
  justify?: FlexJustify
  wrap?: FlexWrap

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
  children?: React.ReactNode
}

// =============================================================================
// MAPPINGS
// =============================================================================

const directionMap: Record<FlexDirection, "row" | "column" | "row-reverse" | "column-reverse"> = {
  row: "row",
  column: "column",
  "row-reverse": "row-reverse",
  "column-reverse": "column-reverse",
}

const alignMap: Record<FlexAlign, "flex-start" | "center" | "flex-end" | "stretch" | "baseline"> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
}

const justifyMap: Record<
  FlexJustify,
  "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"
> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
}

const wrapMap: Record<FlexWrap, "wrap" | "nowrap" | "wrap-reverse"> = {
  wrap: "wrap",
  nowrap: "nowrap",
  "wrap-reverse": "wrap-reverse",
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Flex = memo(function Flex({
  // Flex-specific
  direction = "column",
  align,
  justify,
  wrap,
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
  // Rest
  style,
  children,
  ...rest
}: FlexProps) {
  const theme = useThemeValue()

  // Resolve spacing values
  const resolveSpacing = (value: SpacingToken | number | undefined): number | undefined => {
    if (value === undefined) return undefined
    if (typeof value === "number") return value
    return theme.spacing[value]
  }

  // Build style object
  const flexStyle = {
    // Flex layout
    flexDirection: directionMap[direction],
    alignItems: align ? alignMap[align] : undefined,
    justifyContent: justify ? justifyMap[justify] : undefined,
    flexWrap: wrap ? wrapMap[wrap] : undefined,
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
  }

  return (
    <View style={[flexStyle, style]} {...rest}>
      {children}
    </View>
  )
})
