<script setup lang="ts">
import NavBar from '@/sections/NavBar.vue'
import SiteFooter from '@/sections/SiteFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
    <NavBar />
    <RouterView />
    <SiteFooter />
  </div>
</template>
