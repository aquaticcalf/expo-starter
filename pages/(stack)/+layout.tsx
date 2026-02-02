import type { LayoutProps } from "@/router"
import type { StackScreenOptions } from "@/router/stack"
import { Stack } from "@/router/stack"

// rerender-memo-with-default-value: hoist non-primitive props outside component
const SCREEN_OPTIONS: StackScreenOptions = {
  headerShown: true,
  headerBackVisible: true,
  headerBackgroundColor: "#ffffff",
  headerTintColor: "#007AFF",
}

/**
 * Stack layout for stack-based navigation with header
 *
 * Pages inside this (stack) group will have a header with back navigation.
 * Configure the header options by updating the SCREEN_OPTIONS object above.
 */
export default function StackLayout({ children }: LayoutProps) {
  return <Stack screenOptions={SCREEN_OPTIONS}>{children}</Stack>
}
