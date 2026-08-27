import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import en from './locales/en'

function getSavedLocale(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('tinadec-locale') ?? 'zh-CN'
  }
  return 'zh-CN'
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages: {
    'zh-CN': zhCN,
    en,
  },
})

export default i18n
