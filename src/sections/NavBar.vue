<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Menu, X, Download } from '@lucide/vue'
import logoSvg from '@tinadec/ui/assets/logo/tinadec-logo.svg?raw'
import { UiButton } from '@tinadec/ui'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const open = ref(false)

const links = [
  { href: '#workbench', key: 'nav.product' },
  { href: '#architecture', key: 'nav.architecture' },
  { href: '#governance', key: 'nav.governance' },
  { href: '#opensource', key: 'nav.opensource' },
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[var(--border-muted)] bg-[var(--bg-secondary)]/80 backdrop-blur">
    <div class="mx-auto flex h-14 max-w-6xl items-center gap-3 px-6">
      <a href="#top" class="flex items-center gap-2">
        <span class="h-6 w-6 text-[var(--text-brand)] [&>svg]:h-full [&>svg]:w-full" v-html="logoSvg" aria-label="Tinadec" role="img"></span>
        <span class="text-sm font-bold tracking-tight">Tinadec</span>
      </a>

      <nav class="ml-6 hidden items-center gap-1 md:flex">
        <a
          v-for="l in links"
          :key="l.href"
          :href="l.href"
          class="rounded-md px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
        >{{ t(l.key) }}</a>
      </nav>

      <div class="ml-auto flex items-center gap-1">
        <LanguageSwitcher class="hidden sm:block" />
        <ThemeToggle />
        <UiButton size="sm" class="hidden sm:inline-flex">
          <Download class="h-4 w-4" />
          {{ t('nav.download') }}
        </UiButton>
        <UiButton variant="ghost" size="icon" class="md:hidden" :aria-label="t('nav.menu')" @click="open = !open">
          <Menu v-if="!open" class="h-4 w-4" />
          <X v-else class="h-4 w-4" />
        </UiButton>
      </div>
    </div>

    <div v-if="open" class="border-t border-[var(--border-muted)] bg-[var(--bg-secondary)] px-6 py-3 md:hidden">
      <nav class="flex flex-col gap-1">
        <a
          v-for="l in links"
          :key="l.href"
          :href="l.href"
          class="rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          @click="open = false"
        >{{ t(l.key) }}</a>
        <div class="mt-2 flex items-center gap-2">
          <LanguageSwitcher />
          <UiButton size="sm">
            <Download class="h-4 w-4" />
            {{ t('nav.download') }}
          </UiButton>
        </div>
      </nav>
    </div>
  </header>
</template>
