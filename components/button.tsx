/**
 * Button Component
 *
 * Interactive button with variants, sizes, and color schemes.
 * Uses Pressable for animated feedback.
 */

import { memo } from "react"
import { View, StyleSheet } from "react-native"
import { useThemeValue } from "@/theme"
import { Pressable, type PressableProps } from "./pressable"
import { Text } from "./text"
import { Icon, type IconProps } from "./icon"
import { Spinner } from "./spinner"

// =============================================================================
// TYPES
// =============================================================================

type ButtonVariant = "solid" | "subtle" | "outline" | "ghost"
type ButtonSize = "sm" | "md" | "lg"
type ButtonColorScheme = "brand" | "success" | "warning" | "error" | "info" | "neutral"

export type ButtonProps = Omit<PressableProps, "children"> & {
  variant?: ButtonVariant
  size?: ButtonSize
  colorScheme?: ButtonColorScheme
  loading?: boolean
  disabled?: boolean
  leftIcon?: IconProps["name"]
  rightIcon?: IconProps["name"]
  children: React.ReactNode
}

// =============================================================================
// SIZE CONFIGURATION
// =============================================================================

type SizeConfig = {
  height: number
  paddingHorizontal: number
  fontSize: "body-small" | "body" | "body-large"
  iconSize: "sm" | "md" | "lg"
  gap: number
}

const sizeConfig: Record<ButtonSize, SizeConfig> = {
  sm: {
    height: 32,
    paddingHorizontal: 12,
    fontSize: "body-small",
    iconSize: "sm",
    gap: 6,
  },
  md: {
    height: 40,
    paddingHorizontal: 16,
    fontSize: "body",
    iconSize: "md",
    gap: 8,
  },
  lg: {
    height: 48,
    paddingHorizontal: 20,
    fontSize: "body-large",
    iconSize: "lg",
    gap: 10,
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Button = memo(function Button({
  variant = "solid",
  size = "md",
  colorScheme = "brand",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  style,
  ...rest
}: ButtonProps) {
  const theme = useThemeValue()
  const config = sizeConfig[size]

  // Get colors based on variant and color scheme
  const colors = getButtonColors(variant, colorScheme, disabled, theme)

  const buttonStyle = {
    height: config.height,
    paddingHorizontal: config.paddingHorizontal,
    borderRadius: theme.radius.md,
    backgroundColor: colors.background,
    borderWidth: variant === "outline" ? 1 : 0,
    borderColor: colors.border,
  }

  const isDisabled = disabled || loading

  // Flatten style prop
  const flatStyle = Array.isArray(style) ? style : style ? [style] : []

  return (
    <Pressable
      disabled={isDisabled}
      style={[styles.button, buttonStyle, ...flatStyle]}
      opacityOnPress={isDisabled ? 1 : 0.8}
      scaleOnPress={isDisabled ? 1 : 0.97}
      {...rest}
    >
      <View style={[styles.content, { gap: config.gap }]}>
        {loading ? (
          <Spinner
            size="sm"
            color={
              variant === "solid"
                ? "inverse"
                : colorScheme === "neutral"
                  ? "foreground"
                  : colorScheme
            }
          />
        ) : (
          <>
            {leftIcon && (
              <Icon
                name={leftIcon}
                size={config.iconSize}
                color={getIconColor(variant, colorScheme, disabled)}
              />
            )}
            <Text
              variant={config.fontSize}
              weight="medium"
              color={getTextColor(variant, colorScheme, disabled)}
            >
              {children}
            </Text>
            {rightIcon && (
              <Icon
                name={rightIcon}
                size={config.iconSize}
                color={getIconColor(variant, colorScheme, disabled)}
              />
            )}
          </>
        )}
      </View>
    </Pressable>
  )
})

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
})

// =============================================================================
// HELPERS
// =============================================================================

type ButtonColors = {
  background: string | undefined
  border: string | undefined
}

function getButtonColors(
  variant: ButtonVariant,
  colorScheme: ButtonColorScheme,
  disabled: boolean,
  theme: ReturnType<typeof useThemeValue>,
): ButtonColors {
  if (disabled) {
    return {
      background: variant === "solid" ? theme.colors.background.muted : undefined,
      border: variant === "outline" ? theme.colors.border.disabled : undefined,
    }
  }

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
      case "ghost":
        return { background: undefined, border: undefined }
    }
  }

  // Handle brand separately (no border property)
  if (colorScheme === "brand") {
    const schemeColors = {
      solid: theme.colors.brand.default,
      subtle: theme.colors.brand.subtle,
      border: theme.colors.border.focus,
    }

    switch (variant) {
      case "solid":
        return { background: schemeColors.solid, border: undefined }
      case "subtle":
        return { background: schemeColors.subtle, border: undefined }
      case "outline":
        return { background: undefined, border: schemeColors.border }
      case "ghost":
        return { background: undefined, border: undefined }
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
    case "ghost":
      return { background: undefined, border: undefined }
  }
}

function getTextColor(
  variant: ButtonVariant,
  colorScheme: ButtonColorScheme,
  disabled: boolean,
): "default" | "muted" | "inverse" | "brand" | "error" | "success" | "warning" | "info" {
  if (disabled) return "muted"
  if (variant === "solid") return colorScheme === "neutral" ? "inverse" : "inverse"
  if (colorScheme === "neutral") return "default"
  return colorScheme
}

function getIconColor(
  variant: ButtonVariant,
  colorScheme: ButtonColorScheme,
  disabled: boolean,
): IconProps["color"] {
  if (disabled) return "muted"
  if (variant === "solid") return "inverse"
  if (colorScheme === "neutral") return "default"
  return colorScheme
}
