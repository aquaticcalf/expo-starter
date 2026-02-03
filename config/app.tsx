import { useEffect, useState } from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, View } from "react-native"
import { FileSystemRouter } from "@/router"
import { ThemeProvider, useColors, useIsDark } from "@/theme"
import { LoggerProvider, createHybridAdapter, type LoggerAdapter } from "@/logger"

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
  const [loggerAdapter, setLoggerAdapter] = useState<LoggerAdapter | null>(null)

  useEffect(() => {
    async function initLogger() {
      const adapter = await createHybridAdapter({ console: true, file: { filename: "app.jsonl" } })
      setLoggerAdapter(adapter)
    }
    initLogger()
  }, [])

  return (
    <SafeAreaProvider>
      {loggerAdapter && (
        <LoggerProvider adapter={loggerAdapter}>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </LoggerProvider>
      )}
    </SafeAreaProvider>
  )
}
