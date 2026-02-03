import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { StyleSheet } from "react-native"
import { FileSystemRouter } from "@/router"
import { ThemeProvider, useColors, useIsDark } from "@/theme"

function AppContent() {
  const isDark = useIsDark()
  const colors = useColors()

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <SafeAreaView
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.background.app }]}
        edges={[]}
      >
        <FileSystemRouter />
      </SafeAreaView>
    </>
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
