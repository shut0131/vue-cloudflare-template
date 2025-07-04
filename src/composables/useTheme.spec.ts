import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'

// We need to reset the module state between tests
let useTheme: any
let ThemeMode: any

describe('useTheme', () => {
  beforeEach(async () => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
    
    // Reset DOM
    document.documentElement.classList.remove('dark')
    
    // Reset module cache to get fresh instance
    vi.resetModules()
    
    // Re-import the module
    const module = await import('./useTheme')
    useTheme = module.useTheme
    ThemeMode = module.ThemeMode
    
    // Wait for any initial effects
    await nextTick()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('applies dark class when theme is dark', async () => {
    const { setThemeMode } = useTheme()
    
    setThemeMode(ThemeMode.DARK)
    await nextTick()
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class when theme is light', async () => {
    const { setThemeMode } = useTheme()
    
    // First set to dark
    setThemeMode(ThemeMode.DARK)
    await nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    
    // Then set to light
    setThemeMode(ThemeMode.LIGHT)
    await nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggles through themes correctly', async () => {
    const { themeMode, toggleTheme } = useTheme()
    
    // Set initial state to light
    toggleTheme() // to light
    await nextTick()
    expect(themeMode.value).toBe(ThemeMode.LIGHT)
    
    // Toggle to dark
    toggleTheme()
    await nextTick()
    expect(themeMode.value).toBe(ThemeMode.DARK)
    
    // Toggle back to system
    toggleTheme()
    await nextTick()
    expect(themeMode.value).toBe(ThemeMode.SYSTEM)
  })

  it('persists theme to localStorage', async () => {
    const { setThemeMode } = useTheme()
    
    setThemeMode(ThemeMode.DARK)
    await nextTick()
    
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', ThemeMode.DARK)
  })

  it('respects system preference when in system mode', async () => {
    // Mock dark mode preference
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    
    // Re-import after mocking
    vi.resetModules()
    const module = await import('./useTheme')
    const { themeMode, appliedTheme } = module.useTheme()
    
    await nextTick()
    
    expect(themeMode.value).toBe(module.ThemeMode.SYSTEM)
    expect(appliedTheme.value).toBe(module.ThemeMode.DARK)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})