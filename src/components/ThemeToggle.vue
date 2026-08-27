<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sun, Moon, Monitor } from '@lucide/vue'
import { UiButton, UiTooltip } from '@tinadec/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type Mode = 'light' | 'dark' | 'system'
const mode = ref<Mode>('system')

const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

function apply() {
  const dark = mode.value === 'dark' || (mode.value === 'system' && (mq?.matches ?? false))
  document.documentElement.classList.toggle('dark', dark)
}

function cycle() {
  mode.value = mode.value === 'light' ? 'dark' : mode.value === 'dark' ? 'system' : 'light'
  localStorage.setItem('tinadec-theme', mode.value)
  apply()
}

onMounted(() => {
  const saved = localStorage.getItem('tinadec-theme')
  if (saved === 'light' || saved === 'dark' || saved === 'system') mode.value = saved
  else mode.value = document.documentElement.classList.contains('dark') ? 'dark' : 'system'
  apply()
  mq?.addEventListener('change', apply)
})
</script>

<template>
  <UiTooltip :content="mode === 'light' ? t('theme.light') : mode === 'dark' ? t('theme.dark') : t('theme.system')">
    <UiButton variant="ghost" size="icon" :aria-label="t('theme.dark')" @click="cycle">
      <Sun v-if="mode === 'light'" class="h-4 w-4" />
      <Moon v-else-if="mode === 'dark'" class="h-4 w-4" />
      <Monitor v-else class="h-4 w-4" />
    </UiButton>
  </UiTooltip>
</template>
