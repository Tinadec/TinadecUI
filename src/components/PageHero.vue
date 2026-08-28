<script setup lang="ts">
interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
}
defineProps<Props>()
</script>

<template>
  <section class="hero-glow relative overflow-hidden border-b border-[var(--border-muted)]">
    <div class="mx-auto max-w-6xl px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
      <div v-if="eyebrow" class="mb-3 text-xs font-semibold tracking-widest text-[var(--text-brand)] uppercase">
        {{ eyebrow }}
      </div>
      <h1 class="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{{ title }}</h1>
      <p v-if="subtitle" class="mt-4 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">{{ subtitle }}</p>
      <div v-if="$slots.default" class="mt-7">
        <slot />
      </div>
    </div>
  </section>
</template>
