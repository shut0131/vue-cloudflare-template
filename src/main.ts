import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Enable MSW in development mode
async function enableMocking(): Promise<void> {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')
  
  // Start the worker with onUnhandledRequest set to 'bypass' 
  // to allow real API calls to pass through when not mocked
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}

// Wait for MSW to initialize before mounting the app
enableMocking().then(() => {
  createApp(App).mount('#app')
})