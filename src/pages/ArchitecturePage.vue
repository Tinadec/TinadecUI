<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Cpu, Wrench, Route, AppWindow, ArrowRight } from '@lucide/vue'
import PageHero from '@/components/PageHero.vue'
import Architecture from '@/sections/Architecture.vue'
import { UiButton } from '@tinadec/ui'

const { t, tm } = useI18n()

type LayerKey = 'core' | 'tools' | 'gateway' | 'apps'
const layerKeys: LayerKey[] = ['core', 'tools', 'gateway', 'apps']
const icons = { core: Cpu, tools: Wrench, gateway: Route, apps: AppWindow } as const

interface Layer {
  key: string
  name: string
  role: string
  desc: string
  responsibilities: string[]
  boundaries: string[]
  forms: string[]
  tech: string[]
}

function strArray(key: string): string[] {
  return (tm(key) as { toString(): string }[]).map((x) => String(x))
}

const layers = computed<Layer[]>(() =>
  layerKeys.map((k) => ({
    key: k,
    name: String(t(`architecturePage.items.${k}.name`)),
    role: String(t(`architecturePage.items.${k}.role`)),
    desc: String(t(`architecturePage.items.${k}.desc`)),
    responsibilities: strArray(`architecturePage.items.${k}.responsibilities`),
    boundaries: strArray(`architecturePage.items.${k}.boundaries`),
    forms: strArray(`architecturePage.items.${k}.forms`),
    tech: strArray(`architecturePage.items.${k}.tech`),
  })),
)
</script>

<template>
  <div>
    <PageHero :eyebrow="t('architecturePage.eyebrow')" :title="t('architecturePage.title')" :subtitle="t('architecturePage.subtitle')">
      <router-link to="/products">
        <UiButton size="lg">
          {{ t('architecturePage.ctaLabel') }}
          <ArrowRight class="h-4 w-4" />
        </UiButton>
      </router-link>
    </PageHero>

    <!-- 四层详解 -->
    <section class="scroll-mt-20 py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mb-3 text-xs font-semibold tracking-widest text-[var(--text-brand)] uppercase">{{ t('architecturePage.layerEyebrow') }}</div>
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ t('architecturePage.layerTitle') }}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--text-secondary)]">{{ t('architecturePage.layerSubtitle') }}</p>

        <div class="mt-10 space-y-10">
          <article
            v-for="it in layers"
            :id="it.key"
            :key="it.key"
            class="scroll-mt-24 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-section)] p-6 sm:p-8"
            :style="{ boxShadow: 'var(--shadow-panel)' }"
          >
            <div class="flex flex-wrap items-center gap-3">
              <span class="flex h-11 w-11 items-center justify-center rounded-lg" style="background: var(--accent-soft); color: var(--text-brand)">
                <component :is="icons[it.key as LayerKey]" class="h-5 w-5" />
              </span>
              <div>
                <div class="text-xl font-bold">{{ it.name }}</div>
                <div class="text-xs font-medium" style="color: var(--text-brand)">{{ it.role }}</div>
              </div>
              <div class="ml-auto flex flex-wrap gap-2">
                <span v-for="tech in it.tech" :key="tech" class="rounded-full border px-3 py-1 text-xs font-mono" style="border-color: var(--border-default); color: var(--text-secondary)">
                  {{ tech }}
                </span>
              </div>
            </div>

            <p class="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">{{ it.desc }}</p>

            <div class="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <div class="mb-2 text-xs font-semibold tracking-widest text-[var(--text-brand)] uppercase">{{ t('architecturePage.labelResponsibilities') }}</div>
                <ul class="space-y-2">
                  <li v-for="r in it.responsibilities" :key="r" class="flex items-start gap-2 text-xs leading-relaxed text-[var(--text-primary)]">
                    <span class="mt-1 h-1 w-1 shrink-0 rounded-full" style="background: var(--accent-brand)" />
                    {{ r }}
                  </li>
                </ul>
              </div>
              <div>
                <div class="mb-2 text-xs font-semibold tracking-widest text-[var(--text-muted)] uppercase">{{ t('architecturePage.labelBoundaries') }}</div>
                <ul class="space-y-2">
                  <li v-for="b in it.boundaries" :key="b" class="flex items-start gap-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                    <span class="mt-1 h-1 w-1 shrink-0 rounded-full" style="background: var(--text-muted)" />
                    {{ b }}
                  </li>
                </ul>
              </div>
              <div>
                <div class="mb-2 text-xs font-semibold tracking-widest text-[var(--text-muted)] uppercase">{{ t('architecturePage.labelForms') }}</div>
                <ul class="space-y-2">
                  <li v-for="f in it.forms" :key="f" class="flex items-start gap-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                    <span class="mt-1 h-1 w-1 shrink-0 rounded-full" style="background: var(--accent-primary)" />
                    {{ f }}
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 默认组合拓扑 -->
    <section class="border-t border-[var(--border-muted)] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mb-3 text-xs font-semibold tracking-widest text-[var(--text-brand)] uppercase">{{ t('architecturePage.topologyEyebrow') }}</div>
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ t('architecturePage.topologyTitle') }}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--text-secondary)]">{{ t('architecturePage.topologyDesc') }}</p>

        <div class="mt-10 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-section)] p-8">
          <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span class="rounded-lg border px-4 py-2 text-sm font-semibold" style="border-color: var(--border-default); background: var(--surface-raised)">
              TinadecApp
            </span>
            <span class="text-xs font-mono text-[var(--text-muted)]">HTTP / SSE / WS</span>
            <span class="rounded-lg border px-4 py-2 text-sm font-semibold" style="border-color: var(--border-default); background: var(--surface-raised)">
              TinadecGateway
            </span>
            <span class="text-xs font-mono text-[var(--text-muted)]">/api/v1</span>
            <span class="rounded-lg border px-4 py-2 text-sm font-semibold" style="border-color: var(--border-input-focus); background: var(--bg-selected); color: var(--text-brand)">
              TinadecCore
            </span>
            <span class="text-xs font-mono text-[var(--text-muted)]">Tool Provider</span>
            <span class="rounded-lg border px-4 py-2 text-sm font-semibold" style="border-color: var(--border-default); background: var(--surface-raised)">
              TinadecTools
            </span>
          </div>
          <div class="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span class="rounded-full border border-dashed px-3 py-1 text-[var(--text-secondary)]">{{ t('architecturePage.topologyDirect') }}</span>
            <span class="rounded-full border border-dashed px-3 py-1 text-[var(--text-secondary)]">{{ t('architecturePage.topologyOtherTools') }}</span>
            <span class="rounded-full border border-dashed px-3 py-1 text-[var(--text-secondary)]">{{ t('architecturePage.topologyOtherHosts') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- DmaEA -->
    <Architecture />

    <!-- CTA -->
    <section class="hero-glow border-t border-[var(--border-muted)]">
      <div class="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('architecturePage.ctaTitle') }}</h2>
        <p class="mt-3 text-base text-[var(--text-secondary)]">{{ t('architecturePage.ctaDesc') }}</p>
        <div class="mt-8 flex items-center justify-center gap-3">
          <router-link to="/products/tinadec-office">
            <UiButton size="lg">
              {{ t('architecturePage.ctaProduct') }}
              <ArrowRight class="h-4 w-4" />
            </UiButton>
          </router-link>
          <router-link to="/products">
            <UiButton size="lg" variant="outline">
              {{ t('nav.products') }}
            </UiButton>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
