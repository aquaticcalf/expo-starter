import { memo, useCallback, type ReactNode } from "react"
import { Box, Flex, Text, Pressable } from "@/components"
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
}

/**
 * Individual tab button - memoized to prevent re-renders
 * rerender-memo: extract expensive work into memoized component
 */
const TabButton = memo(function TabButton({
  tab,
  active,
  onPress,
}: {
  tab: TabItem
  active: boolean
  onPress: () => void
}) {
  // rendering-conditional-render: use ternary not &&
  const icon = active && tab.activeIcon ? tab.activeIcon : tab.icon

  return (
    <Pressable onPress={onPress} style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}>
      {icon}
      <Text
        variant="caption"
        weight={active ? "semibold" : "normal"}
        color={active ? "brand" : "subtle"}
        style={{ marginTop: 4 }}
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
export function Tabs({ tabs, children }: TabsProps) {
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
    <Box flex={1}>
      <Box flex={1}>{children}</Box>
      <Flex
        direction="row"
        bg="surface"
        borderColor="muted"
        style={{ borderTopWidth: 1, paddingBottom: 20, paddingTop: 8 }}
      >
        {tabs.map((tab) => {
          const active = isTabActive(tab.href)

          return (
            <TabButton
              key={tab.href}
              tab={tab}
              active={active}
              // Using arrow function here is acceptable because TabButton is memoized
              // and will only re-render when its props change
              onPress={() => handleTabPress(tab.href)}
            />
          )
        })}
      </Flex>
    </Box>
  )
}
