<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check, Languages } from '@lucide/vue'
import { UiButton } from '@tinadec/ui'

const { locale, t } = useI18n()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

// 中国站 / 国际站 —— 仅两个明确的站点选项，不含「跟随系统」。
const options = computed(() => [
  { value: 'zh-CN', label: t('nav.siteChina'), sub: '简体中文' },
  { value: 'en', label: t('nav.siteGlobal'), sub: 'English' },
])

const current = computed(
  () => options.value.find((o) => o.value === locale.value) ?? options.value[0],
)

function setLang(value: string) {
  locale.value = value
  localStorage.setItem('tinadec-locale', value)
  document.documentElement.lang = value === 'zh-CN' ? 'zh-CN' : 'en'
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="relative">
    <UiButton variant="ghost" size="sm" class="gap-1.5" :aria-label="current.label" @click="open = !open">
      <Languages class="h-4 w-4" />
      <span class="text-xs">{{ current.label }}</span>
    </UiButton>

    <div
      v-if="open"
      class="absolute right-0 top-full z-50 mt-1 min-w-[10rem] overflow-hidden rounded-lg border border-[var(--border-muted)] bg-[var(--surface-raised)] p-1 shadow-lg"
    >
      <button
        v-for="o in options"
        :key="o.value"
        type="button"
        class="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-[var(--surface-hover)]"
        :class="
          o.value === locale
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        "
        @click="setLang(o.value)"
      >
        <span>
          <span class="block text-sm">{{ o.label }}</span>
          <span class="block text-xs opacity-60">{{ o.sub }}</span>
        </span>
        <Check v-if="o.value === locale" class="h-3.5 w-3.5 shrink-0 text-[var(--text-brand)]" />
      </button>
    </div>
  </div>
</template>
