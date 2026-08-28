<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Download, ArrowRight } from '@lucide/vue'
import { UiButton, UiBadge } from '@tinadec/ui'
import TerminalWindow from '@/components/TerminalWindow.vue'

const { t, tm } = useI18n()
const router = useRouter()

type TermLine = { kind: 'cmd' | 'ok' | 'warn' | 'dim'; text: string }
const termLines = computed<TermLine[]>(() => (tm('hero.terminal') as unknown[]).map((x) => x as TermLine))

/* --- Hero title typewriter --- */
const typedLines = computed(() => (tm('hero.typed') as { toString(): string }[]).map((x) => String(x)))

const lineIdx = ref(0)
const charCount = ref(0)
const deleting = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function tick() {
  const line = typedLines.value[lineIdx.value] ?? ''
  if (!deleting.value) {
    charCount.value++
    if (charCount.value >= line.length) {
      deleting.value = true
      timer = setTimeout(tick, 1800)
      return
    }
    timer = setTimeout(tick, 90)
  } else {
    charCount.value--
    if (charCount.value <= 0) {
      deleting.value = false
      lineIdx.value = (lineIdx.value + 1) % typedLines.value.length
      timer = setTimeout(tick, 400)
      return
    }
    timer = setTimeout(tick, 40)
  }
}

/* --- Live terminal player ---
   Types the first (cmd) line character by character, then reveals the output
   lines one by one — an approval-gated agent run coming to life. */
const shown = ref(0)
const cmdTyped = ref(0)
const running = ref(true)
let cancelled = false

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

async function playTerminal() {
  const lines = termLines.value
  await sleep(500)
  if (cancelled) return
  shown.value = 1
  const first = lines[0]
  if (first && first.kind === 'cmd') {
    while (cmdTyped.value < first.text.length) {
      cmdTyped.value++
      await sleep(70)
      if (cancelled) return
    }
  }
  for (let i = 1; i < lines.length; i++) {
    if (cancelled) return
    await sleep(lines[i].kind === 'warn' ? 1500 : 500)
    shown.value = i + 1
  }
  await sleep(900)
  if (!cancelled) running.value = false
}

function termPrefix(kind: TermLine['kind']) {
  return kind === 'cmd' ? '❯' : kind === 'ok' ? '✓' : kind === 'warn' ? '⏳' : '·'
}

function termPrefixClass(kind: TermLine['kind']) {
  if (kind === 'cmd') return 'text-[var(--accent-primary)]'
  if (kind === 'ok') return 'text-[var(--accent-success)]'
  if (kind === 'warn') return 'text-[var(--accent-warning)]'
  return 'text-[var(--text-muted)]'
}

function goArchitecture() {
  void router.push('/architecture')
}

const typedText = computed(() => (typedLines.value[lineIdx.value] ?? '').slice(0, charCount.value))

onMounted(() => {
  timer = setTimeout(tick, 600)
  void playTerminal()
})
onBeforeUnmount(() => {
  cancelled = true
  clearTimeout(timer)
})
</script>

<template>
  <section id="top" class="hero-glow relative overflow-hidden">
    <div class="mx-auto max-w-6xl px-6 pt-24 pb-24 text-center sm:pt-32 sm:pb-28">
      <UiBadge variant="outline" class="mb-6">{{ t('hero.badge') }}</UiBadge>
      <h1
        class="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.04] tracking-tighter text-balance sm:text-6xl lg:text-7xl"
      >
        {{ t('hero.title') }}
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">
        {{ t('hero.subtitle') }}
      </p>
      <div class="mt-6 h-6 text-sm text-[var(--text-brand)]">
        <span class="type-caret">{{ typedText }}</span>
      </div>
      <div class="mt-8 flex items-center justify-center gap-3">
        <UiButton size="lg">
          <Download class="h-4 w-4" />
          {{ t('hero.ctaDownload') }}
        </UiButton>
        <UiButton size="lg" variant="outline" @click="goArchitecture">
          {{ t('hero.ctaArchitecture') }}
          <ArrowRight class="h-4 w-4" />
        </UiButton>
      </div>

      <TerminalWindow
        :title="`tinadec — ${t('hero.termTitle')}`"
        :busy="running"
        class="mx-auto mt-14 max-w-3xl"
      >
        <div class="term-body space-y-1.5 sm:text-[13px]">
          <div v-for="(line, i) in termLines" :key="i" v-show="i < shown" class="term-line">
            <span class="select-none pr-3" :class="termPrefixClass(line.kind)">{{ termPrefix(line.kind) }}</span>
            <span v-if="line.kind === 'cmd'" class="text-[var(--text-primary)]">
              {{ i === 0 ? line.text.slice(0, cmdTyped) : line.text }}
            </span>
            <span v-else-if="line.kind === 'ok'" class="text-[var(--accent-success)]">{{ line.text }}</span>
            <span v-else-if="line.kind === 'warn'" class="text-[var(--accent-warning)]">{{ line.text }}</span>
            <span v-else class="text-[var(--text-muted)]">{{ line.text }}</span>
            <span v-if="i === shown - 1 && running" class="term-caret" />
          </div>
        </div>
      </TerminalWindow>
    </div>
  </section>
</template>


