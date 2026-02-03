// Type declarations for require.context (Metro/webpack feature)

declare const require: {
  context(
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp,
    mode?: "sync" | "eager" | "weak" | "lazy",
  ): {
    keys(): string[]
    (id: string): unknown
    resolve(id: string): string
  }
} & NodeRequire
