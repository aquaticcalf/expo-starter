/**
 * Avatar Component
 *
 * User image display with fallback initials and status indicator.
 */

import { memo, useState } from "react"
import { View, Image, StyleSheet } from "react-native"
import type { ViewStyle } from "react-native"
import { useThemeValue } from "@/theme"
import { Text } from "../text/text"

// =============================================================================
// TYPES
// =============================================================================

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"
type AvatarStatus = "online" | "offline" | "busy" | "away"

export type AvatarProps = {
  size?: AvatarSize
  src?: string
  fallback?: string
  status?: AvatarStatus
  style?: ViewStyle
}

// =============================================================================
// SIZE CONFIGURATION
// =============================================================================

type SizeConfig = {
  containerSizePx: number
  fontSize: "caption" | "label-small" | "label" | "body" | "title"
  statusSizePx: number
  statusBorderPx: number
}

const sizeConfig: Record<AvatarSize, SizeConfig> = {
  xs: { containerSizePx: 24, fontSize: "caption", statusSizePx: 8, statusBorderPx: 1 },
  sm: { containerSizePx: 32, fontSize: "label-small", statusSizePx: 10, statusBorderPx: 2 },
  md: { containerSizePx: 40, fontSize: "label", statusSizePx: 12, statusBorderPx: 2 },
  lg: { containerSizePx: 56, fontSize: "body", statusSizePx: 14, statusBorderPx: 2 },
  xl: { containerSizePx: 80, fontSize: "title", statusSizePx: 18, statusBorderPx: 3 },
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Avatar = memo(function Avatar({ size = "md", src, fallback, status, style }: AvatarProps) {
  const theme = useThemeValue()
  const config = sizeConfig[size]
  const [imageError, setImageError] = useState(false)

  const showImage = src && !imageError
  const initials = getInitials(fallback)

  const containerStyle = {
    width: config.containerSizePx,
    height: config.containerSizePx,
    borderRadius: config.containerSizePx / 2,
    backgroundColor: theme.colors.brand.subtle,
  }

  return (
    <View style={[styles.container, containerStyle, style]}>
      {showImage ? (
        <Image
          source={{ uri: src }}
          style={[styles.image, { borderRadius: config.containerSizePx / 2 }]}
          onError={() => setImageError(true)}
        />
      ) : (
        <Text variant={config.fontSize} weight="semibold" color="brand">
          {initials}
        </Text>
      )}

      {status ? (
        <View
          style={[
            styles.status,
            {
              width: config.statusSizePx,
              height: config.statusSizePx,
              borderRadius: config.statusSizePx / 2,
              borderWidth: config.statusBorderPx,
              borderColor: theme.colors.background.surface,
              backgroundColor: getStatusColor(status, theme),
            },
          ]}
        />
      ) : null}
    </View>
  )
})

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  status: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
})

// =============================================================================
// HELPERS
// =============================================================================

function getInitials(name?: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function getStatusColor(status: AvatarStatus, theme: ReturnType<typeof useThemeValue>): string {
  switch (status) {
    case "online":
      return theme.colors.success.default
    case "offline":
      return theme.colors.foreground.subtle
    case "busy":
      return theme.colors.error.default
    case "away":
      return theme.colors.warning.default
  }
}
