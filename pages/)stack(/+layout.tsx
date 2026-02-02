import type { LayoutProps } from "@/router"
import { Stack } from "@/router/stack"

/**
 * Stack layout for stack-based navigation with header
 *
 * Pages inside this (stack) group will have a header with back navigation.
 * Configure the header options by updating screenOptions below.
 */
export default function StackLayout({ children }: LayoutProps) {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
        headerBackgroundColor: "#ffffff",
        headerTintColor: "#007AFF",
      }}
    >
      {children}
    </Stack>
  )
}
