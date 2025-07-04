import { ref, watchEffect, Ref } from 'vue'

// Theme types
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

// Current theme mode
const themeMode = ref<ThemeMode>(
  (localStorage.getItem('theme') as ThemeMode) || ThemeMode.SYSTEM
)

// Actually applied theme
const appliedTheme = ref<ThemeMode.LIGHT | ThemeMode.DARK>(ThemeMode.LIGHT)

// Detect browser color scheme preference
const getSystemTheme = (): ThemeMode.LIGHT | ThemeMode.DARK => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return ThemeMode.DARK
  }
  return ThemeMode.LIGHT
}

// Apply theme
const applyTheme = (theme: ThemeMode.LIGHT | ThemeMode.DARK): void => {
  const root = document.documentElement
  if (theme === ThemeMode.DARK) {
    root.classList.add('dark')
    appliedTheme.value = ThemeMode.DARK
  } else {
    root.classList.remove('dark')
    appliedTheme.value = ThemeMode.LIGHT
  }
}

// Determine actual theme based on theme mode
const updateTheme = (): void => {
  let actualTheme: ThemeMode.LIGHT | ThemeMode.DARK
  
  if (themeMode.value === ThemeMode.SYSTEM) {
    actualTheme = getSystemTheme()
  } else {
    actualTheme = themeMode.value as ThemeMode.LIGHT | ThemeMode.DARK
  }
  
  applyTheme(actualTheme)
}

// Watch for system theme changes
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e: MediaQueryListEvent) => {
    if (themeMode.value === ThemeMode.SYSTEM) {
      applyTheme(e.matches ? ThemeMode.DARK : ThemeMode.LIGHT)
    }
  })
}

// Watch theme mode changes
watchEffect(() => {
  updateTheme()
  localStorage.setItem('theme', themeMode.value)
})

// Apply theme on initialization
updateTheme()

export interface UseThemeReturn {
  themeMode: Ref<ThemeMode>
  appliedTheme: Ref<ThemeMode.LIGHT | ThemeMode.DARK>
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
  ThemeMode: typeof ThemeMode
}

export function useTheme(): UseThemeReturn {
  const setThemeMode = (mode: ThemeMode): void => {
    themeMode.value = mode
  }
  
  const toggleTheme = (): void => {
    if (themeMode.value === ThemeMode.LIGHT) {
      themeMode.value = ThemeMode.DARK
    } else if (themeMode.value === ThemeMode.DARK) {
      themeMode.value = ThemeMode.SYSTEM
    } else {
      themeMode.value = ThemeMode.LIGHT
    }
  }
  
  return {
    themeMode,
    appliedTheme,
    setThemeMode,
    toggleTheme,
    ThemeMode
  }
}