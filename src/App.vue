<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import ApiExample from './components/ApiExample.vue'
import { useTheme, ThemeMode } from './composables/useTheme'

// Theme management
const { themeMode, toggleTheme } = useTheme()

// Get theme icon
const getThemeIcon = (): string => {
  if (themeMode.value === ThemeMode.LIGHT) return '☀️'
  if (themeMode.value === ThemeMode.DARK) return '🌙'
  return '🖥️'
}

// Get theme label
const getThemeLabel = (): string => {
  if (themeMode.value === ThemeMode.LIGHT) return 'Light'
  if (themeMode.value === ThemeMode.DARK) return 'Dark'
  return 'System'
}

// Component toggle
const showApiExample = ref<boolean>(false)
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Vue + Cloudflare Workers Template</h1>
      <button @click="toggleTheme" class="theme-button" :title="`Theme: ${getThemeLabel()}`">
        {{ getThemeIcon() }}
      </button>
    </header>
    
    <main class="app-main">
      <nav class="navigation">
        <button 
          @click="showApiExample = false" 
          :class="{ active: !showApiExample }"
        >
          Home
        </button>
        <button 
          @click="showApiExample = true"
          :class="{ active: showApiExample }"
        >
          API Example
        </button>
      </nav>
      
      <div class="content">
        <HelloWorld v-if="!showApiExample" />
        <ApiExample v-else />
      </div>
    </main>
    
    <footer class="app-footer">
      <p>Built with Vue 3 + Cloudflare Workers + D1</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.app-header {
  background-color: var(--header-bg);
  color: var(--header-text);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.theme-button {
  background: transparent;
  border: 1px solid var(--header-text);
  color: var(--header-text);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.theme-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.navigation {
  background-color: var(--bg-secondary);
  padding: 1rem 2rem;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.navigation button {
  background-color: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.navigation button:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.navigation button.active {
  background-color: var(--accent-color);
  color: white;
}

.content {
  flex: 1;
  padding: 2rem;
}

.app-footer {
  background-color: var(--bg-secondary);
  padding: 1rem;
  text-align: center;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
}
</style>