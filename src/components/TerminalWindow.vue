<script setup lang="ts">
import { Plus, TerminalSquare, X } from '@lucide/vue'

interface Props {
  title?: string
  className?: string
  /** When true, shows a pulsing "running" dot in the window chrome. */
  busy?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'tinadec',
  className: '',
  busy: false,
})
</script>

<template>
  <div
    :class="[
      'overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[#0d0f11] text-left shadow-[var(--shadow-elevated)]',
      className,
    ]"
  >
    <!-- VS Code / JetBrains-style terminal tab bar (mirrors TinadecOffice TerminalPanel) -->
    <div class="flex items-center border-b border-[#262b31] bg-[#11151c] pl-3 pr-2">
      <span class="term-body flex items-center gap-1.5 border-b-2 border-[var(--accent-primary)] py-2 pr-3 text-xs text-[var(--text-secondary)]">
        <TerminalSquare class="h-3.5 w-3.5" :style="{ color: 'var(--accent-primary)' }" />
        {{ title }}
        <span v-if="busy" class="ml-1 h-1.5 w-1.5 animate-pulse rounded-full" style="background: var(--accent-success)" />
      </span>
      <button
        type="button"
        tabindex="-1"
        aria-hidden="true"
        class="ml-auto flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)]"
      >
        <Plus class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        tabindex="-1"
        aria-hidden="true"
        class="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)]"
      >
        <X class="h-3.5 w-3.5" />
      </button>
    </div>
    <div class="p-4 sm:p-5">
      <slot />
    </div>
  </div>
</template>

