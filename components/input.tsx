/**
 * Input Component
 *
 * Text input with variants, sizes, and states.
 */

import { memo, useState, useCallback } from "react"
import { TextInput, View, StyleSheet, type TextInputProps } from "react-native"
import { useThemeValue } from "@/theme"
import { Text } from "./text"
import { Icon, type IconProps } from "./icon"
import { Pressable } from "./pressable"

// =============================================================================
// TYPES
// =============================================================================

type InputSize = "sm" | "md" | "lg"
type InputVariant = "outline" | "filled" | "flushed"

export type InputProps = Omit<TextInputProps, "style"> & {
  size?: InputSize
  variant?: InputVariant
  label?: string
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  leftIcon?: IconProps["name"]
  rightIcon?: IconProps["name"]
  clearable?: boolean
  onClear?: () => void
  style?: TextInputProps["style"]
}

// =============================================================================
// SIZE CONFIGURATION
// =============================================================================

type SizeConfig = {
  height: number
  paddingHorizontal: number
  fontSize: number
  iconSize: "sm" | "md" | "lg"
}

const sizeConfig: Record<InputSize, SizeConfig> = {
  sm: { height: 32, paddingHorizontal: 10, fontSize: 14, iconSize: "sm" },
  md: { height: 40, paddingHorizontal: 12, fontSize: 16, iconSize: "md" },
  lg: { height: 48, paddingHorizontal: 16, fontSize: 18, iconSize: "lg" },
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Input = memo(function Input({
  size = "md",
  variant = "outline",
  label,
  error = false,
  errorMessage,
  disabled = false,
  leftIcon,
  rightIcon,
  clearable = false,
  onClear,
  value,
  onChangeText,
  onFocus,
  onBlur,
  style,
  ...rest
}: InputProps) {
  const theme = useThemeValue()
  const config = sizeConfig[size]
  const [isFocused, setIsFocused] = useState(false)

  // Handle focus
  const handleFocus = useCallback(
    (e: Parameters<NonNullable<TextInputProps["onFocus"]>>[0]) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus],
  )

  // Handle blur
  const handleBlur = useCallback(
    (e: Parameters<NonNullable<TextInputProps["onBlur"]>>[0]) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur],
  )

  // Handle clear
  const handleClear = useCallback(() => {
    onChangeText?.("")
    onClear?.()
  }, [onChangeText, onClear])

  // Get colors
  const borderColor = error
    ? theme.colors.error.default
    : isFocused
      ? theme.colors.border.focus
      : theme.colors.border.default

  const backgroundColor =
    variant === "filled" ? theme.colors.background.muted : theme.colors.background.surface

  // Container style based on variant
  const containerStyle = {
    height: config.height,
    paddingHorizontal: config.paddingHorizontal,
    backgroundColor: variant === "flushed" ? "transparent" : backgroundColor,
    borderRadius: variant === "flushed" ? 0 : theme.radius.md,
    borderWidth: variant === "flushed" ? 0 : 1,
    borderBottomWidth: variant === "flushed" ? 1 : 1,
    borderColor: disabled ? theme.colors.border.disabled : borderColor,
    opacity: disabled ? 0.5 : 1,
  }

  const showClearButton = clearable && value && value.length > 0 && !disabled

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text variant="label" color={error ? "error" : "default"} style={styles.label}>
          {label}
        </Text>
      )}

      <View style={[styles.container, containerStyle]}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            <Icon name={leftIcon} size={config.iconSize} color={disabled ? "subtle" : "muted"} />
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          placeholderTextColor={theme.colors.foreground.subtle}
          style={[
            styles.input,
            {
              fontSize: config.fontSize,
              color: theme.colors.foreground.default,
              paddingLeft: leftIcon ? 8 : 0,
              paddingRight: rightIcon || showClearButton ? 8 : 0,
            },
            style,
          ]}
          {...rest}
        />

        {showClearButton && (
          <Pressable onPress={handleClear} style={styles.clearButton} scaleOnPress={0.9}>
            <Icon name="x-circle-fill" size={config.iconSize} color="subtle" />
          </Pressable>
        )}

        {rightIcon && !showClearButton && (
          <View style={styles.rightIcon}>
            <Icon name={rightIcon} size={config.iconSize} color={disabled ? "subtle" : "muted"} />
          </View>
        )}
      </View>

      {errorMessage && error && (
        <Text variant="caption" color="error" style={styles.errorMessage}>
          {errorMessage}
        </Text>
      )}
    </View>
  )
})

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    marginBottom: 6,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: "100%",
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
  },
  clearButton: {
    marginLeft: 4,
    padding: 4,
  },
  errorMessage: {
    marginTop: 4,
  },
})
