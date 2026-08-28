<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

// 中国站 / 国际站 —— 仅两个明确的站点选项，不含「跟随系统」。
const options = computed(() => [
  { value: 'zh-CN', label: t('nav.siteChina') },
  { value: 'en', label: t('nav.siteGlobal') },
])

const activeIndex = computed(() => {
  const i = options.value.findIndex((o) => o.value === locale.value)
  return i < 0 ? 0 : i
})

function setLang(value: string) {
  locale.value = value
  localStorage.setItem('tinadec-locale', value)
  document.documentElement.lang = value === 'zh-CN' ? 'zh-CN' : 'en'
}

/* ---- Qoder-style slider: the thumb rests on the active language. Click a
        slot to jump, or drag the thumb — wherever it lands is the locale. ---- */
const trackEl = ref<HTMLElement | null>(null)
const thumbEl = ref<HTMLElement | null>(null)
const dragging = ref(false)
const dragPx = ref<number | null>(null)
let startPointerX = 0
let startThumbLeft = 0

const thumbStyle = computed(() => ({
  width: `calc((100% - 4px) / ${options.value.length})`,
  transform:
    dragPx.value !== null
      ? `translateX(${dragPx.value}px)`
      : `translateX(${activeIndex.value * 100}%)`,
}))

function onTrackDown(e: PointerEvent) {
  const track = trackEl.value
  const thumb = thumbEl.value
  if (!track || !thumb) return
  const tr = track.getBoundingClientRect()
  const tw = tr.width
  const bw = thumb.getBoundingClientRect().width
  const step = (tw - bw) / (options.value.length - 1)
  const thumbLeft = activeIndex.value * step
  const x = e.clientX - tr.left

  if (x >= thumbLeft && x <= thumbLeft + bw) {
    // 按在滑块上 → 开始拖拽
    dragging.value = true
    startPointerX = e.clientX
    startThumbLeft = thumbLeft
    dragPx.value = thumbLeft
    track.setPointerCapture(e.pointerId)
  } else {
    // 按在滑块外 → 直接切到该语言
    const idx = Math.round(x / step)
    const clamped = Math.max(0, Math.min(options.value.length - 1, idx))
    setLang(options.value[clamped].value)
  }
}

function onTrackMove(e: PointerEvent) {
  if (!dragging.value) return
  const track = trackEl.value
  const thumb = thumbEl.value
  if (!track || !thumb) return
  const tw = track.getBoundingClientRect().width
  const bw = thumb.getBoundingClientRect().width
  const x = startThumbLeft + (e.clientX - startPointerX)
  dragPx.value = Math.max(0, Math.min(tw - bw, x))
}

function onTrackUp() {
  if (!dragging.value) return
  dragging.value = false
  const track = trackEl.value
  const thumb = thumbEl.value
  if (track && thumb) {
    const tw = track.getBoundingClientRect().width
    const bw = thumb.getBoundingClientRect().width
    const step = (tw - bw) / (options.value.length - 1)
    const idx = Math.round((dragPx.value ?? 0) / step)
    const clamped = Math.max(0, Math.min(options.value.length - 1, idx))
    setLang(options.value[clamped].value)
  }
  dragPx.value = null
}
</script>

<template>
  <div
    ref="trackEl"
    class="relative flex touch-none select-none items-center rounded-full border border-[var(--border-default)] bg-[var(--surface-raised)] p-0.5"
    role="tablist"
    aria-label="Language"
    @pointerdown="onTrackDown"
    @pointermove="onTrackMove"
    @pointerup="onTrackUp"
    @pointercancel="onTrackUp"
  >
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="tab"
      :aria-selected="o.value === locale"
      class="pointer-events-none relative z-10 w-20 rounded-full py-1 text-center text-xs font-medium"
      :class="
        o.value === locale
          ? 'text-[var(--text-primary)]'
          : 'text-[var(--text-muted)]'
      "
    >
      {{ o.label }}
    </button>

    <!-- sliding thumb — drag it anywhere; the slot it lands on becomes the locale -->
    <div
      ref="thumbEl"
      class="pointer-events-none absolute inset-y-0.5 left-0.5 z-0 rounded-full bg-[var(--surface-hover)] shadow-sm ring-1 ring-inset ring-[var(--border-muted)]"
      :class="dragging ? 'transition-none' : 'transition-transform duration-200 ease-out'"
      :style="thumbStyle"
    />
  </div>
</template>
