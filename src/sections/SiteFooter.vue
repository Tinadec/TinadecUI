<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import logoSvg from '@tinadec/ui/assets/logo/tinadec-logo.svg?raw'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()

const cols = [
  {
    title: 'footer.product',
    links: [
      { label: 'nav.products', to: '/products' },
      { label: 'nav.architecture', to: '/architecture' },
      { label: 'nav.governance', to: '/#governance' },
      { label: 'footer.market', to: '/products' },
    ],
  },
  {
    title: 'footer.resources',
    links: [
      { label: 'footer.docs', to: '/architecture' },
      { label: 'footer.changelog', to: '/products' },
      { label: 'nav.download', to: '/' },
    ],
  },
  {
    title: 'footer.legal',
    links: [
      { label: 'footer.terms', to: '/' },
      { label: 'footer.privacy', to: '/' },
      { label: 'footer.license', to: '/' },
    ],
  },
]
</script>

<template>
  <footer class="border-t border-[var(--border-muted)] bg-[var(--bg-secondary)]">
    <div class="mx-auto max-w-6xl px-6 py-12">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="h-6 w-6 text-[var(--text-brand)] [&>svg]:h-full [&>svg]:w-full" v-html="logoSvg" aria-label="Tinadec" role="img"></span>
            <span class="text-sm font-bold">Tinadec</span>
          </div>
          <p class="mt-3 max-w-xs text-xs text-[var(--text-muted)]">{{ t('hero.subtitle') }}</p>
        </div>

        <nav v-for="col in cols" :key="col.title" class="text-sm">
          <div class="mb-3 text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">{{ t(col.title) }}</div>
          <router-link
            v-for="l in col.links"
            :key="l.label"
            :to="l.to"
            class="block py-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >{{ t(l.label) }}</router-link>
        </nav>
      </div>

      <div class="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[var(--border-muted)] pt-6 sm:flex-row sm:items-center">
        <p class="text-xs text-[var(--text-muted)]">
          © 2026 Lincube. {{ t('footer.rights') }}
        </p>
        <div class="flex items-center gap-2">
          <span class="text-xs text-[var(--text-muted)]">{{ t('footer.language') }}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  </footer>
</template>
