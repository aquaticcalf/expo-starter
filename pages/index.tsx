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

export default function Home() {
  return (
    <html.div data-layoutconformance="strict" style={styles.container}>
      <html.span style={styles.text}>Home Page</html.span>
    </html.div>
  )
}
