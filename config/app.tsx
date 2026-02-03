import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, View } from "react-native"
import { FileSystemRouter } from "@/router"
import { ThemeProvider, useColors, useIsDark } from "@/theme"

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

function AppContent() {
  const isDark = useIsDark()
  const colors = useColors()

  return (
    <View style={[styles.container, { backgroundColor: colors.background.surface }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <FileSystemRouter />
      </SafeAreaView>
    </View>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
