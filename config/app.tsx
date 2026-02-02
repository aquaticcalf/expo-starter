import { StatusBar } from "expo-status-bar"
import { html, css } from "react-strict-dom"

const styles = css.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
  },
})

export default function App() {
  return (
    <html.div data-layoutconformance="strict" style={styles.container}>
      <html.span style={styles.text}>Open up app.tsx to start working on your app!</html.span>
      <StatusBar style="auto" />
    </html.div>
  )
}
