import { html, css } from "react-strict-dom"
import type { LayoutProps } from "@/router"

const styles = css.create({
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
    <html.div data-layoutconformance="strict" style={styles.root}>
      <html.div style={styles.header}>
        <html.span style={styles.headerText}>My App</html.span>
      </html.div>
      <html.div style={styles.content}>{children}</html.div>
    </html.div>
  )
}
