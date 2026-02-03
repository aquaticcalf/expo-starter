/**
 * Theme Context and Provider
 *
 * Provides theme access throughout the app with support for:
 * - Light/Dark mode switching.
 * - System color scheme detection.
 * - Persisted theme preference (optional).
 *
 * Design rationale: Theme is provided via context rather than global state
 * to enable proper React lifecycle integration and testing isolation.
 */

import { createContext, useCallback, useMemo, useState, type ReactNode } from "react"
import { useColorScheme } from "react-native"
import type { Theme, ThemeMode } from "./types"
import { lightTheme } from "./themes/light"
import { darkTheme } from "./themes/dark"

// =============================================================================
// CONTEXT TYPES
// =============================================================================

export interface ThemeContextValue {
  /** Current resolved theme object. */
  theme: Theme

  /** Current theme mode setting (light, dark, or system). */
  themeMode: ThemeMode

  /** Resolved mode after system preference (light or dark). */
  resolvedMode: "light" | "dark"

  /** Whether dark mode is active. */
  isDark: boolean

  /** Set the theme mode. */
  setThemeMode: (mode: ThemeMode) => void

  /** Toggle between light and dark (ignores system). */
  toggleTheme: () => void
}

// =============================================================================
// CONTEXT
// =============================================================================

export const ThemeContext = createContext<ThemeContextValue | null>(null)

// =============================================================================
// PROVIDER PROPS
// Callbacks go last in props interface following TigerStyle conventions.
// =============================================================================

export interface ThemeProviderProps {
  children: ReactNode

  /** Initial theme mode (defaults to "system"). */
  defaultMode?: ThemeMode

  /** Custom light theme (optional). */
  lightTheme?: Theme

  /** Custom dark theme (optional). */
  darkTheme?: Theme

  /** Callback when theme mode changes (for persistence). */
  onThemeModeChange?: (mode: ThemeMode) => void
}

// =============================================================================
// PROVIDER
// =============================================================================

export function ThemeProvider({
  children,
  defaultMode = "system",
  lightTheme: customLightTheme,
  darkTheme: customDarkTheme,
  onThemeModeChange,
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme()
  const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultMode)

  // Resolve the actual mode based on setting and system preference.
  // Falls back to "light" if system preference is unavailable.
  const resolvedMode = useMemo((): "light" | "dark" => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? "dark" : "light"
    }
    return themeMode
  }, [themeMode, systemColorScheme])

  // Get the appropriate theme object based on resolved mode.
  const theme = useMemo((): Theme => {
    const light = customLightTheme ?? lightTheme
    const dark = customDarkTheme ?? darkTheme
    return resolvedMode === "dark" ? dark : light
  }, [resolvedMode, customLightTheme, customDarkTheme])

  // Theme mode setter with persistence callback.
  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setThemeModeState(mode)
      onThemeModeChange?.(mode)
    },
    [onThemeModeChange],
  )

  // Toggle theme using functional setState to avoid stale closure.
  // This computes the next mode from current state rather than captured value.
  const toggleTheme = useCallback(() => {
    setThemeModeState((current) => {
      // If currently system, check what it resolved to and flip.
      if (current === "system") {
        return systemColorScheme === "dark" ? "light" : "dark"
      }
      return current === "dark" ? "light" : "dark"
    })
  }, [systemColorScheme])

  // Memoize context value to prevent unnecessary consumer re-renders.
  const value = useMemo(
    (): ThemeContextValue => ({
      theme,
      themeMode,
      resolvedMode,
      isDark: resolvedMode === "dark",
      setThemeMode,
      toggleTheme,
    }),
    [theme, themeMode, resolvedMode, setThemeMode, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// =============================================================================
// DEFAULT THEMES EXPORT
// =============================================================================

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const
