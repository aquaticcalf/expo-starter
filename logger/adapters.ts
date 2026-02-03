import * as FileSystem from "expo-file-system"
import { createConsoleAdapter, type LoggerAdapter } from "afterlog"
import type { FileAdapterConfig } from "./types"

const LOG_DIR = `${FileSystem.Paths.document.uri}logs/`

// js-cache-function-results: Cache TextEncoder instance
const textEncoder = new TextEncoder()

async function ensureLogDirectory(): Promise<void> {
  const dir = new FileSystem.Directory(LOG_DIR)
  if (!dir.exists) {
    dir.create({ intermediates: true })
  }
}

export function createConsoleLogAdapter() {
  return createConsoleAdapter({ pretty: true })
}

export async function createFileAdapter(config: FileAdapterConfig = {}): Promise<LoggerAdapter> {
  await ensureLogDirectory()

  const directory = config.directory ?? LOG_DIR
  const filename = config.filename ?? "app.jsonl"
  const filepath = `${directory}${filename}`
  // maxFiles is reserved for future log rotation implementation
  void config.maxFiles

  let fileHandle: FileSystem.FileHandle | null = null
  let currentFile: FileSystem.File | null = null

  async function getFileHandle(): Promise<{
    file: FileSystem.File
    handle: FileSystem.FileHandle
  }> {
    if (!currentFile || !fileHandle) {
      currentFile = new FileSystem.File(filepath)
      if (!currentFile.exists) {
        currentFile.create({ overwrite: true })
      }
      fileHandle = currentFile.open()
    }
    return { file: currentFile, handle: fileHandle }
  }

  const fileAdapter: LoggerAdapter = {
    async emit(event: Record<string, unknown>) {
      try {
        const line = JSON.stringify(event) + "\n"
        const { handle } = await getFileHandle()
        handle.writeBytes(textEncoder.encode(line))
      } catch {
        console.error("[Logger] Failed to write log to file")
      }
    },

    async flush() {
      if (fileHandle) {
        fileHandle.close()
        fileHandle = null
        currentFile = null
      }
    },

    async destroy() {
      if (fileHandle) {
        fileHandle.close()
        fileHandle = null
        currentFile = null
      }
    },

    isHealthy() {
      return true
    },
  }

  return fileAdapter
}

export async function createHybridAdapter(config?: {
  console?: boolean
  file?: FileAdapterConfig
}): Promise<LoggerAdapter> {
  const adapters: LoggerAdapter[] = []

  if (config?.console ?? true) {
    adapters.push(createConsoleLogAdapter())
  }

  if (config?.file ?? true) {
    const fileAdapter = await createFileAdapter(config?.file)
    adapters.push(fileAdapter)
  }

  return {
    async emit(event: Record<string, unknown>) {
      await Promise.all(adapters.map((adapter) => adapter.emit(event)))
    },
    async flush() {
      await Promise.all(adapters.map((adapter) => adapter.flush?.()))
    },
    async destroy() {
      await Promise.all(adapters.map((adapter) => adapter.destroy?.()))
    },
    isHealthy() {
      return adapters.every((adapter) => adapter.isHealthy?.() ?? true)
    },
  }
}
