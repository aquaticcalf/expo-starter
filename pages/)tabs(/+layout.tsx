import type { LayoutProps } from "@/router"
import { Tabs } from "@/router/tabs"

/**
 * Tabs layout for bottom tab navigation
 *
 * Pages inside this (tabs) group will have bottom tab navigation.
 * Configure your tabs by updating the tabs array below.
 */
export default function TabsLayout({ children }: LayoutProps) {
  return (
    <Tabs
      tabs={[
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/profile", label: "Profile" },
      ]}
      activeTintColor="#007AFF"
      inactiveTintColor="#8E8E93"
    >
      {children}
    </Tabs>
  )
}
