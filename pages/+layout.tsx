import { Text, View } from "react-native"
import type { LayoutProps } from "@/router"
import { useThemedStyles } from "@/theme"

export default function RootLayout({ children }: LayoutProps) {
  const styles = useThemedStyles((theme) => ({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background.app,
    },
    header: {
      padding: theme.spacing[4],
      backgroundColor: theme.colors.background.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.default,
    },
    headerText: {
      ...theme.typography.scale.xl,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.foreground.default,
    },
    content: {
      flex: 1,
    },
  }))

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My App</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  )
}
