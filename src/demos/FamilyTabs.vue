<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppWindow, BrainCircuit, Wrench, Network, Check } from '@lucide/vue'
import { UiButton } from '@tinadec/ui'

const { t } = useI18n()

const keys = ['app', 'core', 'tool', 'gateway'] as const
type Key = (typeof keys)[number]
const active = ref<Key>('app')

const icons = { app: AppWindow, core: BrainCircuit, tool: Wrench, gateway: Network } as const

const mockTitle = computed(() => t(`family.products.${active.value}.name`))
const mockTagline = computed(() => t(`family.products.${active.value}.tagline`))
const mockDesc = computed(() => t(`family.products.${active.value}.desc`))
</script>

<template>
  <UiButton
    v-for="k in keys"
    :key="k"
    size="sm"
    :variant="active === k ? 'secondary' : 'ghost'"
    @click="active = k"
  >
    <component :is="icons[k]" class="h-4 w-4" />
    {{ t(`family.products.${k}.name`) }}
  </UiButton>

  <div class="mt-8 grid items-center gap-8 lg:grid-cols-2">
    <div>
      <h3 class="text-2xl font-bold">{{ mockTitle }}</h3>
      <div class="mt-1 text-sm font-medium text-[var(--text-brand)]">{{ mockTagline }}</div>
      <p class="mt-4 text-base text-[var(--text-secondary)]">{{ mockDesc }}</p>
    </div>

    <div class="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]" style="box-shadow: var(--shadow-panel)">
      <div class="flex h-8 items-center gap-2 border-b border-[var(--border-muted)] bg-[var(--bg-tertiary)] px-4">
        <span class="h-2 w-2 rounded-full" style="background: #f85149" />
        <span class="h-2 w-2 rounded-full" style="background: #d29922" />
        <span class="h-2 w-2 rounded-full" style="background: #2ec4b6" />
      </div>

      <!-- App: chat workbench -->
      <div v-if="active === 'app'" class="space-y-2 p-5">
        <div class="ml-auto w-fit max-w-[70%] rounded-lg px-3 py-1.5 text-xs" style="background: var(--bg-user-msg)">
          {{ t('workbench.userMsg') }}
        </div>
        <div class="w-fit max-w-[80%] rounded-lg border px-3 py-1.5 text-xs" style="background: var(--bg-assistant-msg); border-color: var(--bg-assistant-msg-border)">
          {{ t('workbench.assistantMsg') }}
        </div>
        <div class="chat-shimmer w-fit text-xs">{{ t('workbench.thinking') }} …</div>
      </div>

      <!-- Core: dual-layer topology -->
      <div v-else-if="active === 'core'" class="space-y-3 p-5">
        <div class="rounded-lg border border-[var(--border-input-focus)] bg-[var(--bg-selected)] p-3">
          <div class="text-[10px] font-semibold tracking-wider text-[var(--text-brand)] uppercase">operation</div>
          <div class="mt-1 flex gap-2">
            <span v-for="i in 3" :key="i" class="h-1.5 flex-1 rounded-full" style="background: var(--accent-soft)" />
          </div>
        </div>
        <div class="flex justify-center">
          <div class="h-4 w-px" style="background: var(--border-default)" />
        </div>
        <div class="rounded-lg border p-3" style="border-color: var(--border-default)">
          <div class="text-[10px] font-semibold tracking-wider text-[var(--text-secondary)] uppercase">execution</div>
          <div class="mt-1 flex gap-2">
            <span v-for="i in 4" :key="i" class="h-1.5 flex-1 rounded-full" style="background: var(--bg-hover)" />
          </div>
        </div>
      </div>

      <!-- Tool: approval-gated file ops -->
      <div v-else-if="active === 'tool'" class="space-y-1.5 p-5 font-mono text-xs">
        <div v-for="(f, i) in ['src/main.ts', 'src/api/routes.ts', 'docs/architecture.md']" :key="f" class="flex items-center justify-between rounded-md px-2 py-1.5" style="background: var(--surface-section)">
          <span style="color: var(--text-secondary)">{{ f }}</span>
          <Check v-if="i < 2" class="h-3.5 w-3.5" style="color: var(--accent-success)" />
          <span v-else class="text-[10px]" style="color: var(--accent-warning)">{{ t('workbench.waitingApproval') }}</span>
        </div>
      </div>

      <!-- Gateway: proxy chain -->
      <div v-else class="flex items-center gap-2 p-5 text-xs">
        <div v-for="(n, i) in ['App', 'Gateway', 'Core']" :key="n" class="flex items-center gap-2">
          <div class="rounded-md border px-3 py-2" style="border-color: var(--border-default); background: var(--surface-section)">{{ n }}</div>
          <div v-if="i < 2" class="h-px w-6" style="background: var(--text-brand)" />
        </div>
      </div>
    </div>
  </div>
</template>
