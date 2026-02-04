import type { LayoutProps } from "@/router"
import type { TabItem } from "@/router/tabs"
import { Tabs } from "@/router/tabs"
import { Icon } from "@/components"

// rerender-memo-with-default-value: hoist non-primitive props outside component
const TAB_CONFIG: TabItem[] = [
  {
    href: "/",
    label: "Home",
    icon: <Icon name="home" size="md" color="default" />,
    activeIcon: <Icon name="home-fill" size="md" color="brand" />,
  },
  {
    href: "/explore",
    label: "Explore",
    icon: <Icon name="globe" size="md" color="default" />,
    activeIcon: <Icon name="globe" size="md" color="brand" />,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <Icon name="person" size="md" color="default" />,
    activeIcon: <Icon name="person-fill" size="md" color="brand" />,
  },
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
