import type { LoggerAdapter } from "afterlog"

export type { LoggerAdapter }

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LoggerConfig {
  adapter: LoggerAdapter
  level?: LogLevel
  service?: string
  version?: string
}

export interface FileAdapterConfig {
  directory?: string
  filename?: string
  maxFiles?: number
}

export interface UseLoggerReturn {
  debug: (message: string, data?: Record<string, unknown>) => void
  info: (message: string, data?: Record<string, unknown>) => void
  warn: (message: string, data?: Record<string, unknown>) => void
  error: (message: string, error?: Error, data?: Record<string, unknown>) => void
}
