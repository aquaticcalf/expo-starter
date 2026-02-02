import { FileSystemRouter } from "@/router"
import type { PageModule } from "@/router"

// import all pages eagerly
const pages = import.meta.glob<PageModule>("../pages/**/*.tsx", { eager: true })

export default function App() {
  return <FileSystemRouter pages={pages} />
}
