import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeMode, ThemeContextType } from '../types/theme'

// Storage key for theme preference
const THEME_STORAGE_KEY = 'ticket-app-theme'

// Get initial theme from localStorage or system preference
const getInitialTheme = (): ThemeMode => {
  // Check localStorage first
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }
  
  // Fall back to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme Provider Component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme)

  // Toggle theme
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem(THEME_STORAGE_KEY, newMode)
  }

  // Set specific theme
  const setTheme = (themeMode: ThemeMode) => {
    setMode(themeMode)
    localStorage.setItem(THEME_STORAGE_KEY, themeMode)
  }

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  }, [mode])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if user hasn't manually set a preference
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      if (!storedTheme) {
        setMode(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const value: ThemeContextType = {
    mode,
    toggleTheme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
