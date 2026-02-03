import { useCallback } from "react"
import { Pressable } from "@/components"
import type { LinkProps } from "./types"
import { useNavigate } from "./hooks"

/**
 * Link component for navigation
 * Wraps children in a Pressable that navigates on press
 */
export function Link({ href, replace = false, children, onPress }: LinkProps) {
  const navigate = useNavigate()

  const handlePress = useCallback(() => {
    onPress?.()
    navigate(href, { replace })
  }, [href, replace, navigate, onPress])

  return <Pressable onPress={handlePress}>{children}</Pressable>
}
