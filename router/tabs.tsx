import type { ReactNode } from "react"
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

  const isTabActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = isTabActive(tab.href)
          const tintColor = active ? activeTintColor : inactiveTintColor

          return (
            <Pressable key={tab.href} style={styles.tab} onPress={() => navigate(tab.href)}>
              {active && tab.activeIcon ? tab.activeIcon : tab.icon}
              <Text style={[styles.tabLabel, { color: tintColor }, active && styles.activeLabel]}>
                {tab.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
