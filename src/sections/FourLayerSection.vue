<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Cpu, Wrench, Route, AppWindow, ArrowUpRight } from '@lucide/vue'
import SectionShell from '@/components/SectionShell.vue'
import { UiButton } from '@tinadec/ui'

const { t, tm } = useI18n()

type LayerKey = 'core' | 'tools' | 'gateway' | 'apps'
const layerKeys: LayerKey[] = ['core', 'tools', 'gateway', 'apps']

const icons = { core: Cpu, tools: Wrench, gateway: Route, apps: AppWindow } as const

// Core / Tools / Gateway drill into the architecture page; Apps leads to products.
const links: Record<LayerKey, string> = {
  core: '/architecture#core',
  tools: '/architecture#tools',
  gateway: '/architecture#gateway',
  apps: '/products',
}

const items = computed(() =>
  layerKeys.map((k) => ({
    key: k,
    name: String(t(`layers.items.${k}.name`)),
    tagline: String(t(`layers.items.${k}.tagline`)),
    desc: String(t(`layers.items.${k}.desc`)),
    points: (tm(`layers.items.${k}.points`) as { toString(): string }[]).map((x) => String(x)),
    to: links[k],
  })),
)
</script>

<template>
  <SectionShell id="layers" :eyebrow="'Tinadec Architecture'" :title="t('layers.title')" :subtitle="t('layers.subtitle')">
    <div class="grid gap-5 md:grid-cols-2">
      <div
        v-for="it in items"
        :key="it.key"
        class="flex flex-col rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--border-input-focus)] hover:bg-[var(--surface-hover)]"
        :style="{ boxShadow: 'var(--shadow-card-subtle)' }"
      >
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-lg" style="background: var(--accent-soft); color: var(--text-brand)">
            <component :is="icons[it.key]" class="h-5 w-5" />
          </span>
          <div>
            <div class="text-base font-bold">{{ it.name }}</div>
            <div class="text-xs font-medium" style="color: var(--text-brand)">{{ it.tagline }}</div>
          </div>
        </div>

        <p class="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{{ it.desc }}</p>

        <ul class="mt-4 space-y-1.5">
          <li v-for="p in it.points" :key="p" class="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span class="h-1 w-1 shrink-0 rounded-full" style="background: var(--accent-brand)" />
            {{ p }}
          </li>
        </ul>

        <div class="mt-5 pt-1">
          <router-link :to="it.to">
            <UiButton variant="ghost" size="sm">
              {{ t('layers.cta') }}
              <ArrowUpRight class="h-3.5 w-3.5" />
            </UiButton>
          </router-link>
        </div>
      </div>
    </div>
  </SectionShell>
</template>
