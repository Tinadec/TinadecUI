<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@lucide/vue'

const { t, tm } = useI18n()

const selected = ref<'operation' | 'execution' | null>(null)

const flowItems = computed(() => (tm('architecture.flow') as { toString(): string }[]).map((x) => String(x)))
const operationItems = computed(() => (tm('architecture.operation.items') as { toString(): string }[]).map((x) => String(x)))
const executionItems = computed(() => (tm('architecture.execution.items') as { toString(): string }[]).map((x) => String(x)))

function inScope(step: string) {
  if (!selected.value) return false
  if (selected.value === 'operation') {
    return new Set(flowItems.value.slice(0, 3)).has(step)
  }
  return new Set(flowItems.value.slice(3)).has(step)
}
</script>

<template>
  <div>
    <p class="mb-6 text-xs text-[var(--text-muted)]">{{ t('architecture.hint') }}</p>

    <div class="grid gap-6 lg:grid-cols-2">
      <button
        type="button"
        class="rounded-xl border p-6 text-left transition-all"
        :class="selected === 'operation'
          ? 'border-[var(--border-input-focus)] bg-[var(--bg-selected)]'
          : 'border-[var(--border-default)] bg-[var(--surface-section)] hover:bg-[var(--surface-hover)]'"
        @mouseenter="selected = 'operation'"
        @focus="selected = 'operation'"
        @click="selected = 'operation'"
      >
        <div class="text-xs font-semibold tracking-widest text-[var(--text-brand)] uppercase">{{ t('architecture.operation.name') }}</div>
        <p class="mt-2 text-sm text-[var(--text-secondary)]">{{ t('architecture.operation.desc') }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="item in operationItems"
            :key="item"
            class="rounded-full border px-3 py-1 text-xs transition-opacity"
            :class="selected === 'operation' ? 'border-[var(--border-input-focus)] text-[var(--text-brand)] opacity-100' : 'border-[var(--border-default)] text-[var(--text-secondary)] opacity-80'"
          >{{ item }}</span>
        </div>
      </button>

      <button
        type="button"
        class="rounded-xl border p-6 text-left transition-all"
        :class="selected === 'execution'
          ? 'border-[var(--border-input-focus)] bg-[var(--bg-selected)]'
          : 'border-[var(--border-default)] bg-[var(--surface-section)] hover:bg-[var(--surface-hover)]'"
        @mouseenter="selected = 'execution'"
        @focus="selected = 'execution'"
        @click="selected = 'execution'"
      >
        <div class="text-xs font-semibold tracking-widest text-[var(--text-secondary)] uppercase">{{ t('architecture.execution.name') }}</div>
        <p class="mt-2 text-sm text-[var(--text-secondary)]">{{ t('architecture.execution.desc') }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="item in executionItems"
            :key="item"
            class="rounded-full border px-3 py-1 text-xs transition-opacity"
            :class="selected === 'execution' ? 'border-[var(--border-input-focus)] text-[var(--text-brand)] opacity-100' : 'border-[var(--border-default)] text-[var(--text-secondary)] opacity-80'"
          >{{ item }}</span>
        </div>
      </button>
    </div>

    <!-- data flow -->
    <div class="mt-8 flex flex-wrap items-center justify-center gap-1.5">
      <template v-for="(step, i) in flowItems" :key="step">
        <span
          class="rounded-full border px-3.5 py-1.5 text-xs transition-all"
          :class="inScope(step)
            ? 'border-[var(--border-input-focus)] text-[var(--text-brand)]'
            : 'border-[var(--border-dashed)] text-[var(--text-muted)]'"
        >{{ step }}</span>
        <ArrowDown
          v-if="i < flowItems.length - 1"
          class="h-3 w-3 rotate-[270deg]"
          :class="inScope(flowItems[i + 1]) && inScope(step) ? 'text-[var(--text-brand)]' : 'text-[var(--border-dashed)]'"
        />
      </template>
    </div>
  </div>
</template>
