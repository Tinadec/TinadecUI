<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionShell from '@/components/SectionShell.vue'
import DualLayerDiagram from '@/demos/DualLayerDiagram.vue'

const { t } = useI18n()
</script>

<template>
  <SectionShell id="architecture" :eyebrow="'DmaEA'" :title="t('architecture.title')" :subtitle="t('architecture.subtitle')">
    <DualLayerDiagram />
  </SectionShell>
</template>
