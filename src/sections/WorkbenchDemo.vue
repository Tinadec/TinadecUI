<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionShell from '@/components/SectionShell.vue'
import WorkbenchMock from '@/demos/WorkbenchMock.vue'

const { t } = useI18n()
</script>

<template>
  <SectionShell id="workbench" :title="t('workbench.title')" :subtitle="t('workbench.subtitle')">
    <WorkbenchMock />
  </SectionShell>
</template>
