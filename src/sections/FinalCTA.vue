<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Download, Code2 } from '@lucide/vue'
import { UiButton } from '@tinadec/ui'

const { t } = useI18n()
</script>

<template>
  <section class="hero-glow border-t border-[var(--border-muted)]">
    <div class="mx-auto max-w-6xl px-6 py-24 text-center">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('cta.title') }}</h2>
      <p class="mt-3 text-base text-[var(--text-secondary)]">{{ t('cta.subtitle') }}</p>
      <div class="mt-8 flex items-center justify-center gap-3">
        <UiButton size="lg">
          <Download class="h-4 w-4" />
          {{ t('cta.primary') }}
        </UiButton>
        <UiButton size="lg" variant="outline">
          <Code2 class="h-4 w-4" />
          {{ t('cta.secondary') }}
        </UiButton>
      </div>
    </div>
  </section>
</template>
