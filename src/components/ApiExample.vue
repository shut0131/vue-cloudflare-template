<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { getSessionId, apiRequest } from '../utils/userSession'
import type { ExampleGetResponse, ExamplePostResponse } from '@/types/api'

const loading: Ref<boolean> = ref(false)
const data: Ref<ExampleGetResponse | ExamplePostResponse | null> = ref(null)
const error: Ref<string | null> = ref(null)
const sessionId: Ref<string> = ref('')

// Sample API call
const fetchData = async (): Promise<void> => {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiRequest('/api/example')
    
    if (!response.ok) {
      throw new Error('API request failed')
    }
    
    data.value = await response.json() as ExampleGetResponse
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

// Save data example
const saveData = async (): Promise<void> => {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiRequest('/api/example', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello from Vue!',
        timestamp: new Date().toISOString()
      })
    })
    
    if (!response.ok) {
      throw new Error('Save failed')
    }
    
    const result = await response.json() as ExamplePostResponse
    data.value = result
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

// Get session ID on mount
onMounted(async () => {
  try {
    sessionId.value = await getSessionId()
  } catch (err) {
    error.value = 'Failed to initialize session'
  }
})
</script>

<template>
  <div class="p-8 max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold text-black dark:text-white mb-6">API Integration Example</h2>
    
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
      <p class="text-gray-700 dark:text-gray-300">Session ID: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-sm">{{ sessionId || 'Initializing...' }}</code></p>
    </div>
    
    <div class="flex gap-4 mb-6">
      <button @click="fetchData" :disabled="loading" style="background-color: var(--color-secondary); color: white;" class="px-6 py-3 rounded-lg text-base cursor-pointer transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
        {{ loading ? 'Loading...' : 'Fetch Data' }}
      </button>
      <button @click="saveData" :disabled="loading" style="background-color: var(--color-secondary); color: white;" class="px-6 py-3 rounded-lg text-base cursor-pointer transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
        {{ loading ? 'Saving...' : 'Save Data' }}
      </button>
    </div>
    
    <div v-if="error" class="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
      Error: {{ error }}
    </div>
    
    <div v-if="data" class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-0 mb-4">Response:</h3>
      <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto m-0 text-sm">{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

