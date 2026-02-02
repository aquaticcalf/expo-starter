import { FileSystemRouter } from "@/router"
import type { PageModule, LayoutModule } from "@/router"

// import all pages eagerly (excluding +layout files)
const pages = import.meta.glob<PageModule>("../pages/**/!(*+layout).tsx", { eager: true })

// import all layouts eagerly
const layouts = import.meta.glob<LayoutModule>("../pages/**/+layout.tsx", { eager: true })

export default function App() {
  return <FileSystemRouter pages={pages} layouts={layouts} />
}
