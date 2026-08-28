<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Menu, X, Download } from '@lucide/vue'
import logoSvg from '@tinadec/ui/assets/logo/tinadec-logo.svg?raw'
import { UiButton } from '@tinadec/ui'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const route = useRoute()
const open = ref(false)

const links = [
  { to: '/', key: 'nav.home', exact: true },
  { to: '/products', key: 'nav.products' },
  { to: '/architecture', key: 'nav.architecture' },
  { to: '/#governance', key: 'nav.governance' },
  { to: '/#opensource', key: 'nav.opensource' },
]

function isActive(to: string) {
  if (to.startsWith('/#')) return route.path === '/' && route.hash === to.slice(1)
  return route.path === to
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[var(--border-muted)] bg-[var(--bg-secondary)]/80 backdrop-blur">
    <div class="mx-auto flex h-14 max-w-6xl items-center gap-3 px-6">
      <router-link to="/" class="flex items-center gap-2">
        <span class="h-6 w-6 text-[var(--text-brand)] [&>svg]:h-full [&>svg]:w-full" v-html="logoSvg" aria-label="Tinadec" role="img"></span>
        <span class="text-sm font-bold tracking-tight">Tinadec</span>
      </router-link>

      <nav class="ml-6 hidden items-center gap-1 md:flex">
        <router-link
          v-for="l in links"
          :key="l.key"
          :to="l.to"
          class="rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-[var(--surface-hover)]"
          :class="isActive(l.to) ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'"
        >{{ t(l.key) }}</router-link>
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
        <router-link
          v-for="l in links"
          :key="l.key"
          :to="l.to"
          class="rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          @click="open = false"
        >{{ t(l.key) }}</router-link>
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
