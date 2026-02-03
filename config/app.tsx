import { SafeAreaProvider } from "react-native-safe-area-context"
import { FileSystemRouter } from "@/router"
import { ThemeProvider } from "@/theme"

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FileSystemRouter />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
