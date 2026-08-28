<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download, Code2, ArrowRight, MessageSquare, ListTree, ShieldCheck, Radio, Bug, TerminalSquare } from '@lucide/vue'
import PageHero from '@/components/PageHero.vue'
import WorkbenchDemo from '@/sections/WorkbenchDemo.vue'
import FinalCTA from '@/sections/FinalCTA.vue'
import { UiButton } from '@tinadec/ui'

const { t, tm } = useI18n()

interface Feature {
  title: string
  desc: string
}
const features = computed<Feature[]>(() =>
  (tm('productOffice.features') as { title: unknown; desc: unknown }[]).map((f) => ({
    title: String(f.title),
    desc: String(f.desc),
  })),
)
const featureIcons = [MessageSquare, ListTree, ShieldCheck, Radio, Bug, TerminalSquare]
</script>

<template>
  <div class="product-office">
    <!-- 面包屑 -->
    <div class="border-b border-[var(--border-muted)]">
      <div class="mx-auto flex max-w-6xl items-center gap-2 px-6 py-3 text-xs text-[var(--text-muted)]">
        <router-link to="/products" class="transition-colors hover:text-[var(--text-primary)]">{{ t('nav.products') }}</router-link>
        <span>/</span>
        <span class="text-[var(--text-secondary)]">{{ t('productOffice.name') }}</span>
      </div>
    </div>

    <PageHero :eyebrow="t('productOffice.eyebrow')" :title="t('productOffice.name')" :subtitle="t('productOffice.tagline')">
      <p class="max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">{{ t('productOffice.desc') }}</p>
      <div class="mt-7 flex items-center gap-3">
        <UiButton size="lg">
          <Download class="h-4 w-4" />
          {{ t('productOffice.ctaPrimary') }}
        </UiButton>
        <UiButton size="lg" variant="outline">
          <Code2 class="h-4 w-4" />
          {{ t('productOffice.ctaSecondary') }}
        </UiButton>
      </div>
    </PageHero>

    <!-- 产品演示 -->
    <WorkbenchDemo />

    <!-- 功能特性 -->
    <section class="border-t border-[var(--border-muted)] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mb-3 text-xs font-semibold tracking-widest text-[var(--text-brand)] uppercase">{{ t('productOffice.featureEyebrow') }}</div>
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ t('productOffice.featureTitle') }}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--text-secondary)]">{{ t('productOffice.featureSubtitle') }}</p>

        <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(f, i) in features"
            :key="f.title"
            class="rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-6 transition-all hover:-translate-y-0.5 hover:bg-[var(--surface-hover)]"
            :style="{ boxShadow: 'var(--shadow-card-subtle)' }"
          >
            <component :is="featureIcons[i % featureIcons.length]" class="mb-3 h-5 w-5" style="color: var(--accent-primary)" />
            <div class="text-sm font-semibold">{{ f.title }}</div>
            <p class="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 四层归属 -->
    <section class="border-t border-[var(--border-muted)] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mb-3 text-xs font-semibold tracking-widest text-[var(--text-brand)] uppercase">{{ t('productOffice.familyEyebrow') }}</div>
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ t('productOffice.familyTitle') }}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--text-secondary)]">{{ t('productOffice.familyDesc') }}</p>

        <div class="mt-10 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-section)] p-8">
          <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span class="rounded-lg border px-4 py-2 text-sm font-semibold" style="border-color: var(--border-input-focus); background: var(--bg-selected); color: var(--text-brand)">
              TinadecOffice
            </span>
            <span class="text-xs font-mono text-[var(--text-muted)]">drives</span>
            <span class="rounded-lg border px-4 py-2 text-sm font-semibold" style="border-color: var(--border-default); background: var(--surface-raised)">
              TinadecCore
            </span>
            <span class="text-xs font-mono text-[var(--text-muted)]">·</span>
            <span class="rounded-lg border px-4 py-2 text-sm font-semibold" style="border-color: var(--border-default); background: var(--surface-raised)">
              TinadecTools
            </span>
            <span class="text-xs font-mono text-[var(--text-muted)]">·</span>
            <span class="rounded-lg border px-4 py-2 text-sm font-semibold" style="border-color: var(--border-default); background: var(--surface-raised)">
              TinadecGateway
            </span>
          </div>
          <div class="mt-5 flex justify-center">
            <router-link to="/architecture">
              <UiButton variant="outline" size="sm">
                {{ t('productOffice.familyCta') }}
                <ArrowRight class="h-3.5 w-3.5" />
              </UiButton>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <FinalCTA />
  </div>
</template>

<style scoped>
/* TinadecOffice page uses its logo palette (teal #1F8F80 light / #2EC4B6 dark,
   matching public/favicon.svg), overriding the site-wide grass-green brand
   accent. Scoped to this page's root so nav/chrome stays on the site accent;
   CSS variables inherit down to PageHero / WorkbenchDemo / FinalCTA. */
.product-office {
  --primary: #1f8f80;
  --ring: #1f8f80;
  --accent-primary: #1f8f80;
  --accent-brand: #1f8f80;
  --text-brand: #1f8f80;
  --border-input-focus: #1f8f80;
  --bg-selected: #dff1ec;
  --bg-selected-outline: #1f8f80;
  --accent-soft: rgba(31, 143, 128, 0.1);
  --accent-soft-2: rgba(31, 143, 128, 0.09);
}
.dark .product-office {
  --primary: #2ec4b6;
  --ring: #2ec4b6;
  --accent-primary: #2ec4b6;
  --accent-brand: #2ec4b6;
  --text-brand: #2ec4b6;
  --border-input-focus: #2ec4b6;
  --bg-selected: #0d2e2a;
  --bg-selected-outline: #2ec4b6;
  --accent-soft: rgba(46, 196, 182, 0.12);
  --accent-soft-2: rgba(46, 196, 182, 0.1);
}
</style>
