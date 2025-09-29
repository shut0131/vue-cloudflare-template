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
  <div class="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
    <header style="background-color: var(--color-primary)" class="text-white px-8 py-4 flex justify-between items-center shadow-lg">
      <h1 class="text-2xl font-bold">Vue + Cloudflare Workers Template</h1>
      <button @click="toggleTheme" class="bg-transparent border border-white text-white p-2 rounded hover:bg-white/10 hover:scale-110 transition-all duration-300 w-10 h-10 flex items-center justify-center text-xl" :title="`Theme: ${getThemeLabel()}`">
        {{ getThemeIcon() }}
      </button>
    </header>
    
    <main class="flex-1 flex flex-col">
      <nav class="bg-gray-50 dark:bg-gray-800 px-8 py-4 flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button 
          @click="showApiExample = false" 
          :class="['px-4 py-2 rounded transition-all duration-300', !showApiExample ? 'text-white' : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100']"
          :style="!showApiExample ? 'background-color: var(--color-primary)' : ''"
        >
          Home
        </button>
        <button 
          @click="showApiExample = true"
          :class="['px-4 py-2 rounded transition-all duration-300', showApiExample ? 'text-white' : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100']"
          :style="showApiExample ? 'background-color: var(--color-primary)' : ''"
        >
          API Example
        </button>
      </nav>
      
      <div class="flex-1 p-8">
        <HelloWorld v-if="!showApiExample" />
        <ApiExample v-else />
      </div>
    </main>
    
    <footer class="bg-gray-50 dark:bg-gray-800 p-4 text-center border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
      <p>Built with Vue 3 + Cloudflare Workers + D1</p>
    </footer>
  </div>
</template>

