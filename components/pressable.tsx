/**
 * Pressable Component
 *
 * Animated pressable wrapper with scale and opacity feedback using Reanimated.
 */

import { memo, useCallback } from "react"
import {
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
  type ViewStyle,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import { useThemeValue } from "@/theme"

// =============================================================================
// TYPES
// =============================================================================

export type PressableProps = Omit<RNPressableProps, "style"> & {
  scaleOnPress?: number
  opacityOnPress?: number
  animationDuration?: number
  disabled?: boolean
  style?: ViewStyle | ViewStyle[]
  children: React.ReactNode
}

// =============================================================================
// ANIMATED PRESSABLE
// =============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable)

// =============================================================================
// COMPONENT
// =============================================================================

export const Pressable = memo(function Pressable({
  scaleOnPress = 0.97,
  opacityOnPress = 0.8,
  animationDuration,
  disabled = false,
  style,
  children,
  onPressIn,
  onPressOut,
  ...rest
}: PressableProps) {
  const theme = useThemeValue()
  const duration = animationDuration ?? theme.duration.fast

  // Shared values for animation
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  // Press handlers
  const handlePressIn = useCallback(
    (event: Parameters<NonNullable<RNPressableProps["onPressIn"]>>[0]) => {
      scale.value = withTiming(scaleOnPress, {
        duration,
        easing: Easing.out(Easing.quad),
      })
      opacity.value = withTiming(opacityOnPress, {
        duration,
        easing: Easing.out(Easing.quad),
      })
      onPressIn?.(event)
    },
    [scale, opacity, scaleOnPress, opacityOnPress, duration, onPressIn],
  )

  const handlePressOut = useCallback(
    (event: Parameters<NonNullable<RNPressableProps["onPressOut"]>>[0]) => {
      scale.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.quad),
      })
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.quad),
      })
      onPressOut?.(event)
    },
    [scale, opacity, duration, onPressOut],
  )

  // Flatten styles
  const flatStyles = Array.isArray(style) ? style : style ? [style] : []

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, ...flatStyles]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  )
})
