<script setup lang="ts">
import { ref, Ref } from 'vue'

const count: Ref<number> = ref(0)
const message: Ref<string> = ref('Hello from Vue 3!')

const increment = (): void => {
  count.value++
}
</script>

<template>
  <div class="hello-world">
    <h1>{{ message }}</h1>
    <p>
      This is a Vue 3 + Cloudflare Workers template with:
    </p>
    <ul>
      <li>Vue 3 with Composition API</li>
      <li>Cloudflare Workers deployment</li>
      <li>D1 Database integration</li>
      <li>Dark/Light theme support</li>
      <li>User session management</li>
    </ul>
    
    <div class="counter">
      <button @click="increment">Count is: {{ count }}</button>
    </div>
    
    <p class="info">
      Edit <code>src/components/HelloWorld.vue</code> to get started.
    </p>
  </div>
</template>

<style scoped>
.hello-world {
  text-align: center;
  padding: 2rem;
}

h1 {
  color: var(--accent-color);
  margin-bottom: 2rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

li {
  margin: 0.5rem 0;
  color: var(--text-secondary);
}

.counter {
  margin: 2rem 0;
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

button:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

.info {
  margin-top: 2rem;
  color: var(--text-secondary);
}

code {
  background-color: var(--bg-code);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
}
</style>