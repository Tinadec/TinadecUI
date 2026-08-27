<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bot, Network, ShieldCheck, RefreshCcw, GitBranch } from '@lucide/vue'
import SectionShell from '@/components/SectionShell.vue'
import ApprovalTimeline from '@/demos/ApprovalTimeline.vue'

const { t, tm } = useI18n()

const values = computed(() =>
  (tm('governance.values') as { title: unknown; desc: unknown }[]).map((v) => ({
    title: String(v.title),
    desc: String(v.desc),
  })),
)

const icons = [Bot, Network, ShieldCheck, RefreshCcw, GitBranch]
</script>

<template>
  <SectionShell id="governance" :title="t('governance.title')" :subtitle="t('governance.subtitle')">
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(v, i) in values"
        :key="v.title"
        class="rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-5 transition-all hover:-translate-y-0.5 hover:bg-[var(--surface-hover)]"
        :style="{ boxShadow: 'var(--shadow-card-subtle)' }"
      >
        <component :is="icons[i % icons.length]" class="mb-3 h-5 w-5" style="color: var(--accent-primary)" />
        <div class="text-sm font-semibold">{{ v.title }}</div>
        <p class="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{{ v.desc }}</p>
      </div>

      <ApprovalTimeline />
    </div>
  </SectionShell>
</template>
