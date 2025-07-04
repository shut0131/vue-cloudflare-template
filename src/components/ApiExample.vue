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
  <div class="api-example">
    <h2>API Integration Example</h2>
    
    <div class="user-info">
      <p>Session ID: <code>{{ sessionId || 'Initializing...' }}</code></p>
    </div>
    
    <div class="actions">
      <button @click="fetchData" :disabled="loading">
        {{ loading ? 'Loading...' : 'Fetch Data' }}
      </button>
      <button @click="saveData" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Data' }}
      </button>
    </div>
    
    <div v-if="error" class="error">
      Error: {{ error }}
    </div>
    
    <div v-if="data" class="result">
      <h3>Response:</h3>
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.api-example {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.user-info {
  background-color: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.user-info code {
  background-color: var(--bg-code);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  background-color: #fee;
  color: var(--error-color);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.dark .error {
  background-color: rgba(239, 83, 80, 0.1);
}

.result {
  background-color: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
}

.result h3 {
  margin-top: 0;
  color: var(--text-primary);
}

.result pre {
  background-color: var(--bg-code);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
}
</style>