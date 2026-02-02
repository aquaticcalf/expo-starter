import { StyleSheet, Text, View } from "react-native"
import type { LayoutProps } from "@/router"

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
})

export default function RootLayout({ children }: LayoutProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My App</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  )
}
