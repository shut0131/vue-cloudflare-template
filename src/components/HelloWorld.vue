<script setup lang="ts">
import { ref, Ref } from 'vue'

const count: Ref<number> = ref(0)
const message: Ref<string> = ref('Hello from Vue 3!')

const increment = (): void => {
  count.value++
}
</script>

<template>
  <div class="text-center p-8">
    <h1 style="color: var(--color-secondary)" class="mb-8">{{ message }}</h1>
    <p class="text-gray-700 dark:text-gray-300">
      This is a Vue 3 + Cloudflare Workers template with:
    </p>
    <ul class="list-none p-0 my-8">
      <li class="my-2 text-gray-600 dark:text-gray-400">Vue 3 with Composition API</li>
      <li class="my-2 text-gray-600 dark:text-gray-400">Cloudflare Workers deployment</li>
      <li class="my-2 text-gray-600 dark:text-gray-400">D1 Database integration</li>
      <li class="my-2 text-gray-600 dark:text-gray-400">Dark/Light theme support</li>
      <li class="my-2 text-gray-600 dark:text-gray-400">User session management</li>
    </ul>
    
    <div class="my-8">
      <button @click="increment" style="background-color: var(--color-secondary); color: white;" class="px-6 py-3 rounded-lg text-base cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">Count is: {{ count }}</button>
    </div>
    
    <p class="mt-8 text-gray-600 dark:text-gray-400">
      Edit <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">src/components/HelloWorld.vue</code> to get started.
    </p>
  </div>
</template>

