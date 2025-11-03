import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './app/router'
import './app/styles/global.css'
import { applyTheme, getStoredTheme } from '@/shared/lib/theme'

applyTheme(getStoredTheme())

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
