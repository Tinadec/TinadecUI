<script setup lang="ts">
interface Props {
  id?: string
  eyebrow?: string
  title: string
  subtitle?: string
}
defineProps<Props>()
</script>

<template>
  <section :id="id" class="scroll-mt-20 py-20 sm:py-24">
    <div class="mx-auto max-w-6xl px-6">
      <div v-if="eyebrow" class="mb-3 text-xs font-semibold tracking-widest text-[var(--text-brand)] uppercase">
        {{ eyebrow }}
      </div>
      <h2 class="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{{ title }}</h2>
      <p v-if="subtitle" class="mt-3 max-w-2xl text-base text-[var(--text-secondary)]">{{ subtitle }}</p>
      <div class="mt-10">
        <slot />
      </div>
    </div>
  </section>
</template>
