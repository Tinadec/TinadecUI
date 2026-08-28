import { createApp } from 'vue'
import * as Vue from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './styles.css'

const vaporInteropPlugin = (Vue as unknown as Record<string, unknown>).vaporInteropPlugin as
  | Parameters<ReturnType<typeof createApp>['use']>[0]
  | undefined

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en',
  messages: {},
})

const app = createApp(App)
if (vaporInteropPlugin) app.use(vaporInteropPlugin)
app.use(i18n)
app.mount('#app')
