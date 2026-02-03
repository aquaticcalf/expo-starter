/**
 * @/memory/context - Memory storage context and provider
 *
 * React context for managing memory storage instances across the app.
 * Provides configuration and access to persistent storage.
 */

import React, { createContext, useCallback, useMemo, useState } from "react"
import { createMMKV, type MMKV } from "react-native-mmkv"
import type { MemoryStorageConfig, MemoryInstance, MemoryProviderProps } from "./types"

// =============================================================================
// Context Types
// =============================================================================

interface MemoryContextValue {
  instance: MemoryInstance | null
  configure: (config: MemoryStorageConfig) => void
  isReady: boolean
  storage: MMKV | null
}

// =============================================================================
// Context Creation
// =============================================================================

export const MemoryContext = createContext<MemoryContextValue | null>(null)

export type MemoryProviderPropsType = MemoryProviderProps

// =============================================================================
// Provider Component
// =============================================================================

export function MemoryProvider({ children, config: initialConfig }: MemoryProviderProps) {
  const [storage, setStorage] = useState<MMKV | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [instance, setInstance] = useState<MemoryInstance | null>(null)

  const configure = useCallback((config: MemoryStorageConfig) => {
    const id = config.id ?? "memory.default"

    const mmkvConfig: Parameters<typeof createMMKV>[0] = {
      id,
    }

    if (config.encryptionKey) {
      mmkvConfig.encryptionKey = config.encryptionKey
    }

    if (config.mode) {
      mmkvConfig.mode = config.mode
    }

    const mmkv = createMMKV(mmkvConfig)
    setStorage(mmkv)
    setInstance({
      id,
      storage: mmkv as unknown as MemoryInstance["storage"],
      cacheConfig: config.cache,
    })
    setIsReady(true)
  }, [])

  // Initialize with initial config if provided
  React.useEffect(() => {
    if (initialConfig && !isReady) {
      configure(initialConfig)
    }
  }, [initialConfig, isReady, configure])

  const contextValue = useMemo(
    () => ({
      instance,
      configure,
      isReady,
      storage,
    }),
    [instance, configure, isReady, storage],
  )

  return <MemoryContext.Provider value={contextValue}>{children}</MemoryContext.Provider>
}
