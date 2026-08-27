<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionShell from '@/components/SectionShell.vue'
import FamilyTabs from '@/demos/FamilyTabs.vue'

const { t } = useI18n()
</script>

<template>
  <SectionShell id="family" :title="t('family.title')" :subtitle="t('family.subtitle')">
    <FamilyTabs />
  </SectionShell>
</template>
