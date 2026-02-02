// types for import.meta.glob (Vite/Metro feature)

declare interface ImportMeta {
  glob: <T>(pattern: string, options?: { eager?: boolean }) => Record<string, T>
}
