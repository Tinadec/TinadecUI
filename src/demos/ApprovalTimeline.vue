<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TerminalSquare, ShieldCheck, ReceiptText, RotateCcw } from '@lucide/vue'
import { UiButton, UiBadge } from '@tinadec/ui'

const { t } = useI18n()

type Phase = 'idle' | 'called' | 'awaiting' | 'approved' | 'receipt' | 'rejected'
const phase = ref<Phase>('idle')
const timers: ReturnType<typeof setTimeout>[] = []

function later(fn: () => void, ms: number) {
  timers.push(setTimeout(fn, ms))
}

function start() {
  timers.forEach(clearTimeout)
  timers.length = 0
  phase.value = 'called'
  later(() => (phase.value = 'awaiting'), 700)
}

function decide(kind: 'approved' | 'rejected') {
  if (phase.value !== 'awaiting') return
  if (kind === 'rejected') {
    phase.value = 'rejected'
    return
  }
  phase.value = 'approved'
  later(() => (phase.value = 'receipt'), 900)
}

onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <div class="rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-6">
    <div class="mb-6 flex items-center justify-between">
      <div class="text-sm font-semibold">{{ t('governance.approvalTitle') }}</div>
      <UiButton v-if="phase === 'idle' || phase === 'rejected'" size="xs" variant="outline" @click="start">
        <RotateCcw class="h-3.5 w-3.5" />
        start
      </UiButton>
    </div>

    <ol class="space-y-0">
      <!-- step 1: tool call -->
      <li class="relative flex gap-4 pb-6">
        <div class="flex flex-col items-center">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full border"
            :class="phase !== 'idle' ? 'border-[var(--border-input-focus)] text-[var(--text-brand)]' : 'border-[var(--border-dashed)] text-[var(--text-muted)]'"
          >
            <TerminalSquare class="h-4 w-4" />
          </span>
          <span v-if="phase !== 'idle'" class="w-px flex-1" style="background: var(--border-default)" />
        </div>
        <div class="min-w-0 flex-1 pb-1">
          <div class="text-sm font-medium">{{ t('workbench.toolCall') }}</div>
          <div v-if="phase !== 'idle'" class="mt-1 font-mono text-xs" style="color: var(--text-secondary)">{{ t('governance.call') }}</div>
        </div>
      </li>

      <!-- step 2: approval -->
      <li class="relative flex gap-4 pb-6">
        <div class="flex flex-col items-center">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
            :class="['awaiting', 'approved', 'receipt'].includes(phase)
              ? 'border-[var(--border-input-focus)] text-[var(--text-brand)]'
              : phase === 'rejected'
                ? 'border-[var(--border-default)] text-[var(--accent-danger)]'
                : 'border-[var(--border-dashed)] text-[var(--text-muted)]'"
          >
            <ShieldCheck class="h-4 w-4" :class="phase === 'awaiting' ? 'activity-glow-icon' : ''" />
          </span>
          <span v-if="['approved', 'receipt', 'rejected'].includes(phase)" class="w-px flex-1" style="background: var(--border-default)" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">{{ t('workbench.approval') }}</span>
            <UiBadge v-if="phase === 'awaiting'" variant="secondary">{{ t('workbench.waitingApproval') }}</UiBadge>
            <UiBadge v-if="phase === 'approved' || phase === 'receipt'" variant="default">{{ t('workbench.approved') }}</UiBadge>
            <UiBadge v-if="phase === 'rejected'" variant="destructive">{{ t('workbench.rejected') }}</UiBadge>
          </div>
          <div v-if="phase === 'awaiting'" class="mt-2 flex gap-2">
            <UiButton size="xs" @click="decide('approved')">{{ t('workbench.approve') }}</UiButton>
            <UiButton size="xs" variant="outline" @click="decide('rejected')">{{ t('workbench.reject') }}</UiButton>
          </div>
        </div>
      </li>

      <!-- step 3: receipt -->
      <li class="flex gap-4">
        <div class="flex flex-col items-center">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full border"
            :class="phase === 'receipt'
              ? 'border-[var(--border-input-focus)] text-[var(--text-brand)]'
              : 'border-[var(--border-dashed)] text-[var(--text-muted)]'"
          >
            <ReceiptText class="h-4 w-4" />
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-sm font-medium">{{ t('governance.receipt') }}</div>
          <div v-if="phase === 'receipt'" class="chat-status-rise mt-1 font-mono text-xs" style="color: var(--text-secondary)">
            {{ t('governance.receipt') }} → {{ t('governance.receiptValue') }}
          </div>
          <div v-if="phase === 'rejected'" class="chat-status-rise mt-1 text-xs" style="color: var(--accent-danger)">
            {{ t('governance.rejectedHint') }}
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>
