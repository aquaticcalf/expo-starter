import { memo, useCallback, type ReactNode } from "react"
import { Box, Flex, Text, Pressable, Icon } from "@/components"
import { useRouter } from "./hooks"

/**
 * Stack screen configuration options
 */
export interface StackScreenOptions {
  /** Title displayed in the header */
  title?: string
  /** Whether to show the header */
  headerShown?: boolean
  /** Whether to show the back button */
  headerBackVisible?: boolean
  /** Custom header left component */
  headerLeft?: ReactNode
  /** Custom header right component */
  headerRight?: ReactNode
  /** Custom header title component */
  headerTitle?: ReactNode
}

/**
 * Props for the Stack component
 */
export interface StackProps {
  /** Content to render (usually children from layout) */
  children: ReactNode
  /** Screen options for this stack */
  screenOptions?: StackScreenOptions
}

/**
 * Props for individual stack screens (used with Stack.Screen)
 */
export interface StackScreenProps {
  /** Route name/path this screen configuration applies to */
  name: string
  /** Screen-specific options */
  options?: StackScreenOptions
}

// rerender-memo-with-default-value: hoist default non-primitive prop
const DEFAULT_SCREEN_OPTIONS: StackScreenOptions = {}

/**
 * Default back button component
 * rerender-memo: memoized to prevent re-renders
 */
const DefaultBackButton = memo(function DefaultBackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center" }}>
      <Icon name="chevron-left" size="lg" color="brand" />
      <Text variant="body" color="brand">
        Back
      </Text>
    </Pressable>
  )
})

/**
 * Stack navigation component with header
 *
 * Provides a header bar with back navigation for stack-based navigation.
 * Use this in a layout file to create stack navigation with headers.
 *
 * @example
 * ```tsx
 * // pages/(stack)/+layout.tsx
 * export default function StackLayout({ children }: LayoutProps) {
 *   return (
 *     <Stack
 *       screenOptions={{
 *         headerShown: true,
 *       }}
 *     >
 *       {children}
 *     </Stack>
 *   )
 * }
 * ```
 */
export function Stack({
  children,
  // rerender-memo-with-default-value: use hoisted default
  screenOptions = DEFAULT_SCREEN_OPTIONS,
}: StackProps) {
  const router = useRouter()

  const {
    title,
    headerShown = true,
    headerBackVisible = true,
    headerLeft,
    headerRight,
    headerTitle,
  } = screenOptions

  const canGoBack = true // In a real implementation, check history length

  // rerender-functional-setstate: stable callback with useCallback
  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  if (!headerShown) {
    return <Box flex={1}>{children}</Box>
  }

  // rendering-conditional-render: use ternary not &&
  const headerLeftContent =
    headerLeft !== undefined ? (
      headerLeft
    ) : headerBackVisible && canGoBack ? (
      <DefaultBackButton onPress={handleBack} />
    ) : null

  const headerTitleContent =
    headerTitle !== undefined ? (
      headerTitle
    ) : title ? (
      <Text variant="body" weight="semibold" color="default">
        {title}
      </Text>
    ) : null

  return (
    <Box flex={1}>
      <Flex
        direction="row"
        align="center"
        bg="surface"
        borderColor="muted"
        px={4}
        style={{ height: 56, borderBottomWidth: 1 }}
      >
        <Box style={{ width: 60, alignItems: "flex-start", justifyContent: "center" }}>
          {headerLeftContent}
        </Box>
        <Box flex={1} center>
          {headerTitleContent}
        </Box>
        <Box style={{ width: 60, alignItems: "flex-end", justifyContent: "center" }}>
          {headerRight}
        </Box>
      </Flex>
      <Box flex={1}>{children}</Box>
    </Box>
  )
}

/**
 * Static property for defining screen-specific options
 * This is a placeholder for future implementation where screens
 * can define their own options
 */
Stack.Screen = function StackScreen(_props: StackScreenProps) {
  // This component is used declaratively to define screen options
  // It doesn't render anything itself
  return null
}
