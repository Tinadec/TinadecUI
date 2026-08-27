import { createApp } from 'vue'
import * as Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import './styles.css'

const vaporInteropPlugin = (Vue as unknown as Record<string, unknown>).vaporInteropPlugin as
  | Parameters<ReturnType<typeof createApp>['use']>[0]
  | undefined

const app = createApp(App)
app.use(i18n)
if (vaporInteropPlugin) app.use(vaporInteropPlugin)
app.mount('#app')
