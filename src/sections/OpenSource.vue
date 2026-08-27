<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { GitFork, Scale, Boxes, ArrowUpRight } from '@lucide/vue'
import SectionShell from '@/components/SectionShell.vue'
import { UiButton, UiBadge } from '@tinadec/ui'

const { t } = useI18n()

const repos = [
  { name: 'TinadecOffice', license: 'GPL-3.0-or-later' },
  { name: 'TinadecCore', license: 'MIT' },
  { name: 'TinadecGateway', license: 'AGPL-3.0-or-later' },
  { name: 'TinadecTools', license: 'AGPL-3.0-or-later' },
]
</script>

<template>
  <SectionShell id="opensource" :title="t('opensource.title')" :subtitle="t('opensource.subtitle')">
    <p class="max-w-2xl text-sm text-[var(--text-secondary)]">{{ t('opensource.desc') }}</p>

    <div class="mt-8 grid gap-4 sm:grid-cols-2">
      <div class="rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-5">
        <GitFork class="mb-3 h-5 w-5" style="color: var(--accent-primary)" />
        <div class="text-sm font-semibold">{{ t('opensource.repo') }}</div>
        <p class="mt-1 text-xs text-[var(--text-muted)]">github.com/lincube</p>
        <UiButton variant="outline" size="sm" class="mt-4" disabled>
          {{ t('opensource.github') }}
          <ArrowUpRight class="h-3.5 w-3.5" />
        </UiButton>
      </div>
      <div class="rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-5">
        <Scale class="mb-3 h-5 w-5" style="color: var(--accent-primary)" />
        <div class="text-sm font-semibold">{{ t('opensource.licenses') }}</div>
        <div class="mt-3 space-y-2">
          <div v-for="r in repos" :key="r.name" class="flex items-center justify-between text-xs">
            <span class="flex items-center gap-1.5 font-mono" style="color: var(--text-secondary)">
              <Boxes class="h-3.5 w-3.5" />{{ r.name }}
            </span>
            <UiBadge variant="secondary">{{ r.license }}</UiBadge>
          </div>
        </div>
      </div>
    </div>
  </SectionShell>
</template>
