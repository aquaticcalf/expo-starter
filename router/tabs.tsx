import { memo, useCallback, type ReactNode } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useNavigate, usePathname } from "./hooks"

/**
 * Tab item configuration
 */
export interface TabItem {
  /** Route path this tab navigates to */
  href: string
  /** Display label for the tab */
  label: string
  /** Optional icon component */
  icon?: ReactNode
  /** Optional active icon component (shown when tab is selected) */
  activeIcon?: ReactNode
}

/**
 * Props for the Tabs component
 */
export interface TabsProps {
  /** Tab configuration items */
  tabs: TabItem[]
  /** Content to render (usually children from layout) */
  children: ReactNode
  /** Active tab tint color */
  activeTintColor?: string
  /** Inactive tab tint color */
  inactiveTintColor?: string
}

// rendering-hoist-jsx: extract static styles outside component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  activeLabel: {
    fontWeight: "600",
  },
})

/**
 * Individual tab button - memoized to prevent re-renders
 * rerender-memo: extract expensive work into memoized component
 */
const TabButton = memo(function TabButton({
  tab,
  active,
  tintColor,
  onPress,
}: {
  tab: TabItem
  active: boolean
  tintColor: string
  onPress: () => void
}) {
  // rendering-conditional-render: use ternary not &&
  const icon = active && tab.activeIcon ? tab.activeIcon : tab.icon

  return (
    <Pressable style={styles.tab} onPress={onPress}>
      {icon}
      <Text
        style={[
          styles.tabLabel,
          { color: tintColor },
          // rendering-conditional-render: use ternary for conditional styles
          active ? styles.activeLabel : null,
        ]}
      >
        {tab.label}
      </Text>
    </Pressable>
  )
})

/**
 * Bottom tab navigation component
 *
 * Provides a tab bar at the bottom of the screen for navigating between routes.
 * Use this in a layout file to create tabbed navigation.
 *
 * @example
 * ```tsx
 * // pages/(tabs)/+layout.tsx
 * export default function TabsLayout({ children }: LayoutProps) {
 *   return (
 *     <Tabs
 *       tabs={[
 *         { href: "/", label: "Home" },
 *         { href: "/explore", label: "Explore" },
 *         { href: "/profile", label: "Profile" },
 *       ]}
 *     >
 *       {children}
 *     </Tabs>
 *   )
 * }
 * ```
 */
export function Tabs({
  tabs,
  children,
  activeTintColor = "#007AFF",
  inactiveTintColor = "#8E8E93",
}: TabsProps) {
  const pathname = usePathname()
  const navigate = useNavigate()

  // rerender-functional-setstate: stable callback with useCallback
  // rerender-dependencies: use primitive dependency (pathname)
  const isTabActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/"
      }
      return pathname === href || pathname.startsWith(`${href}/`)
    },
    [pathname],
  )

  // rerender-functional-setstate: create stable handler factory
  const handleTabPress = useCallback(
    (href: string) => {
      navigate(href)
    },
    [navigate],
  )

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = isTabActive(tab.href)
          const tintColor = active ? activeTintColor : inactiveTintColor

          return (
            <TabButton
              key={tab.href}
              tab={tab}
              active={active}
              tintColor={tintColor}
              // Using arrow function here is acceptable because TabButton is memoized
              // and will only re-render when its props change
              onPress={() => handleTabPress(tab.href)}
            />
          )
        })}
      </View>
    </View>
  )
}
