import { FileSystemRouter } from "@/router"
import { ThemeProvider } from "@/theme"

export default function App() {
  return (
    <ThemeProvider>
      <FileSystemRouter />
    </ThemeProvider>
  )
}
