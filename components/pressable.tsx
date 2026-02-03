/**
 * Pressable Component
 *
 * Animated pressable wrapper with scale and opacity feedback using React Native's built-in Animated API.
 */

import { memo, useCallback, useRef } from "react"
import {
  Pressable as RNPressable,
  Animated,
  Easing,
  type PressableProps as RNPressableProps,
  type ViewStyle,
} from "react-native"
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

  // Animated values
  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(1)).current

  // Press handlers
  const handlePressIn = useCallback(
    (event: Parameters<NonNullable<RNPressableProps["onPressIn"]>>[0]) => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: scaleOnPress,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: opacityOnPress,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start()
      onPressIn?.(event)
    },
    [scaleAnim, opacityAnim, scaleOnPress, opacityOnPress, duration, onPressIn],
  )

  const handlePressOut = useCallback(
    (event: Parameters<NonNullable<RNPressableProps["onPressOut"]>>[0]) => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start()
      onPressOut?.(event)
    },
    [scaleAnim, opacityAnim, duration, onPressOut],
  )

  // Flatten styles
  const flatStyles = Array.isArray(style) ? style : style ? [style] : []

  // Animated style
  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  }

  return (
    <RNPressable
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      <Animated.View style={[animatedStyle, ...flatStyles]}>{children}</Animated.View>
    </RNPressable>
  )
})
