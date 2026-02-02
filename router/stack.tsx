import type { ReactNode } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
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
  /** Header background color */
  headerBackgroundColor?: string
  /** Header tint color (affects back button and title) */
  headerTintColor?: string
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingHorizontal: 16,
  },
  headerLeft: {
    width: 60,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    width: 60,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 17,
    marginLeft: 4,
  },
  backArrow: {
    fontSize: 20,
    fontWeight: "300",
  },
  content: {
    flex: 1,
  },
})

/**
 * Default back button component
 */
function DefaultBackButton({
  tintColor = "#007AFF",
  onPress,
}: {
  tintColor?: string
  onPress: () => void
}) {
  return (
    <Pressable style={styles.backButton} onPress={onPress}>
      <Text style={[styles.backArrow, { color: tintColor }]}>&lt;</Text>
      <Text style={[styles.backButtonText, { color: tintColor }]}>Back</Text>
    </Pressable>
  )
}

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
 *         headerBackgroundColor: "#ffffff",
 *         headerTintColor: "#007AFF",
 *       }}
 *     >
 *       {children}
 *     </Stack>
 *   )
 * }
 * ```
 */
export function Stack({ children, screenOptions = {} }: StackProps) {
  const router = useRouter()

  const {
    title,
    headerShown = true,
    headerBackVisible = true,
    headerLeft,
    headerRight,
    headerTitle,
    headerBackgroundColor = "#ffffff",
    headerTintColor = "#007AFF",
  } = screenOptions

  const canGoBack = true // In a real implementation, check history length

  const handleBack = () => {
    router.back()
  }

  if (!headerShown) {
    return <View style={styles.container}>{children}</View>
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
        <View style={styles.headerLeft}>
          {headerLeft !== undefined ? (
            headerLeft
          ) : headerBackVisible && canGoBack ? (
            <DefaultBackButton tintColor={headerTintColor} onPress={handleBack} />
          ) : null}
        </View>
        <View style={styles.headerCenter}>
          {headerTitle !== undefined ? (
            headerTitle
          ) : title ? (
            <Text style={[styles.headerTitle, { color: headerTintColor }]}>{title}</Text>
          ) : null}
        </View>
        <View style={styles.headerRight}>{headerRight}</View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
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
