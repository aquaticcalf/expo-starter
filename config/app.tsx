import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet } from "react-native"
import { FileSystemRouter } from "@/router"
import { ThemeProvider } from "@/theme"

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
          <FileSystemRouter />
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
