import { ref, watchEffect } from 'vue'

// テーマの種類
export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

// 現在のテーマモード
const themeMode = ref(localStorage.getItem('theme') || ThemeMode.SYSTEM)

// 実際に適用されるテーマ
const appliedTheme = ref(ThemeMode.LIGHT)

// ブラウザのカラースキーム設定を検出
const getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return ThemeMode.DARK
  }
  return ThemeMode.LIGHT
}

// テーマを適用
const applyTheme = (theme) => {
  const root = document.documentElement
  if (theme === ThemeMode.DARK) {
    root.classList.add('dark')
    appliedTheme.value = ThemeMode.DARK
  } else {
    root.classList.remove('dark')
    appliedTheme.value = ThemeMode.LIGHT
  }
}

// テーマモードに基づいて実際のテーマを決定
const updateTheme = () => {
  let actualTheme = themeMode.value
  
  if (themeMode.value === ThemeMode.SYSTEM) {
    actualTheme = getSystemTheme()
  }
  
  applyTheme(actualTheme)
}

// システムテーマの変更を監視
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (themeMode.value === ThemeMode.SYSTEM) {
      applyTheme(e.matches ? ThemeMode.DARK : ThemeMode.LIGHT)
    }
  })
}

// テーマモードの変更を監視
watchEffect(() => {
  updateTheme()
  localStorage.setItem('theme', themeMode.value)
})

// 初期化時にテーマを適用
updateTheme()

export function useTheme() {
  const setThemeMode = (mode) => {
    themeMode.value = mode
  }
  
  const toggleTheme = () => {
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