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
  /** Scale factor when pressed. Defaults to 0.97. */
  scaleOnPress?: number
  /** Opacity when pressed. Defaults to 0.8. */
  opacityOnPress?: number
  /** Animation duration in milliseconds. Defaults to theme.duration.fast. */
  durationMs?: number
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
  durationMs,
  disabled = false,
  style,
  children,
  onPressIn,
  onPressOut,
  ...rest
}: PressableProps) {
  const theme = useThemeValue()
  // Use provided duration or fall back to theme's fast duration (100ms).
  const animationDurationMs = durationMs ?? theme.duration.fast

  // Animated values for scale and opacity transformations.
  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(1)).current

  // Animate scale and opacity on press for tactile feedback.
  const handlePressIn = useCallback(
    (event: Parameters<NonNullable<RNPressableProps["onPressIn"]>>[0]) => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: scaleOnPress,
          duration: animationDurationMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: opacityOnPress,
          duration: animationDurationMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start()
      onPressIn?.(event)
    },
    [scaleAnim, opacityAnim, scaleOnPress, opacityOnPress, animationDurationMs, onPressIn],
  )

  // Restore scale and opacity when press ends.
  const handlePressOut = useCallback(
    (event: Parameters<NonNullable<RNPressableProps["onPressOut"]>>[0]) => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animationDurationMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: animationDurationMs,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start()
      onPressOut?.(event)
    },
    [scaleAnim, opacityAnim, animationDurationMs, onPressOut],
  )

  // Flatten styles to ensure consistent array format for spreading.
  const flatStyles = Array.isArray(style) ? style : style ? [style] : []

  // Combined animated transform and opacity style.
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
