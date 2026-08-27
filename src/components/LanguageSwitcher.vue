<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Languages } from '@lucide/vue'
import { UiButton } from '@tinadec/ui'

const { locale } = useI18n()

function toggle() {
  locale.value = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
  localStorage.setItem('tinadec-locale', locale.value)
  document.documentElement.lang = locale.value === 'zh-CN' ? 'zh-CN' : 'en'
}
</script>

<template>
  <UiButton variant="ghost" size="sm" @click="toggle">
    <Languages class="h-4 w-4" />
    <span class="text-xs">{{ locale === 'zh-CN' ? 'EN' : '中文' }}</span>
  </UiButton>
</template>
