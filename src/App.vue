<script setup lang="ts">
import NavBar from '@/sections/NavBar.vue'
import Hero from '@/sections/Hero.vue'
import WorkbenchDemo from '@/sections/WorkbenchDemo.vue'
import FamilySection from '@/sections/FamilySection.vue'
import Architecture from '@/sections/Architecture.vue'
import Governance from '@/sections/Governance.vue'
import OpenSource from '@/sections/OpenSource.vue'
import FinalCTA from '@/sections/FinalCTA.vue'
import SiteFooter from '@/sections/SiteFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
    <NavBar />
    <main>
      <Hero />
      <WorkbenchDemo />
      <FamilySection />
      <Architecture />
      <Governance />
      <OpenSource />
      <FinalCTA />
    </main>
    <SiteFooter />
  </div>
</template>
