<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download, ArrowRight } from '@lucide/vue'
import { UiButton, UiBadge } from '@tinadec/ui'

const { t, tm } = useI18n()

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

function goArchitecture() {
  window.location.hash = '#architecture'
}

const typedText = computed(() => (typedLines.value[lineIdx.value] ?? '').slice(0, charCount.value))

onMounted(() => {
  timer = setTimeout(tick, 600)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section id="top" class="hero-glow relative overflow-hidden">
    <div class="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
      <UiBadge variant="secondary" class="mb-6">{{ t('hero.badge') }}</UiBadge>
      <h1 class="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
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
    </div>
  </section>
</template>
