import './assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import { Buffer } from 'buffer'

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

window.Buffer = Buffer;

createApp(App).mount('#app')
