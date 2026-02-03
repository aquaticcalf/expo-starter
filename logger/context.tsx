import React, { createContext, useCallback, useMemo, useState, type ReactNode } from "react"
import { afterlog, type Builder } from "afterlog"
import type { LoggerAdapter, UseLoggerReturn } from "./types"

interface LoggerContextValue {
  adapter: LoggerAdapter | null
  configure: (config: {
    adapter: LoggerAdapter
    level?: string
    service?: string
    version?: string
  }) => void
  createBuilder: (init?: Record<string, unknown>) => Builder
  log: UseLoggerReturn
}

export const LoggerContext = createContext<LoggerContextValue | null>(null)

export interface LoggerProviderProps {
  children: ReactNode
  adapter?: LoggerAdapter
  service?: string
  version?: string
}

export function LoggerProvider({ children, adapter, service, version }: LoggerProviderProps) {
  const [configured, setConfigured] = useState(false)

  const configure = useCallback(
    (config: { adapter: LoggerAdapter; level?: string; service?: string; version?: string }) => {
      afterlog.configure({
        adapter: config.adapter,
        service: config.service,
        version: config.version,
      })
      setConfigured(true)
    },
    [],
  )

  React.useEffect(() => {
    if (adapter && !configured) {
      afterlog.configure({
        adapter,
        service,
        version,
      })
      setConfigured(true)
    }
  }, [adapter, service, version, configured])

  const createBuilder = useCallback((init?: Record<string, unknown>) => {
    return afterlog.createBuilder(init)
  }, [])

  const log: UseLoggerReturn = useMemo(
    () => ({
      debug: (message: string, data?: Record<string, unknown>) => {
        const builder = afterlog.createBuilder({ level: "debug", message, ...data })
        afterlog.finalize(builder)
      },
      info: (message: string, data?: Record<string, unknown>) => {
        const builder = afterlog.createBuilder({ level: "info", message, ...data })
        afterlog.finalize(builder)
      },
      warn: (message: string, data?: Record<string, unknown>) => {
        const builder = afterlog.createBuilder({ level: "warn", message, ...data })
        afterlog.finalize(builder)
      },
      error: (message: string, error?: Error, data?: Record<string, unknown>) => {
        const builder = afterlog.createBuilder({ level: "error", message, ...data })
        if (error) {
          builder.error(error)
        }
        afterlog.finalize(builder)
      },
    }),
    [],
  )

  return (
    <LoggerContext.Provider value={{ adapter, configure, createBuilder, log }}>
      {children}
    </LoggerContext.Provider>
  )
}
