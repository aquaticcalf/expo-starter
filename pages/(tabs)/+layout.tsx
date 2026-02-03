import type { LayoutProps } from "@/router"
import type { TabItem } from "@/router/tabs"
import { Tabs } from "@/router/tabs"

// rerender-memo-with-default-value: hoist non-primitive props outside component
const TAB_CONFIG: TabItem[] = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/profile", label: "Profile" },
]

/**
 * Tabs layout for bottom tab navigation
 *
 * Pages inside this (tabs) group will have bottom tab navigation.
 * Configure your tabs by updating the TAB_CONFIG array above.
 * Colors are handled by the theme system.
 */
export default function TabsLayout({ children }: LayoutProps) {
  return <Tabs tabs={TAB_CONFIG}>{children}</Tabs>
}
