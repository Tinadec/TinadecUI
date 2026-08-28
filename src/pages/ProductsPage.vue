<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AppWindow, ArrowRight, Hourglass, Boxes } from '@lucide/vue'
import PageHero from '@/components/PageHero.vue'
import TerminalWindow from '@/components/TerminalWindow.vue'
import FinalCTA from '@/sections/FinalCTA.vue'
import { UiButton, UiBadge } from '@tinadec/ui'

const { t } = useI18n()
</script>

<template>
  <div>
    <PageHero :eyebrow="t('productsPage.eyebrow')" :title="t('productsPage.title')" :subtitle="t('productsPage.subtitle')" />

    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6">
        <!-- 主产品：TinadecOffice -->
        <article
          class="grid items-center gap-8 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-section)] p-6 sm:p-10 lg:grid-cols-2"
          :style="{ boxShadow: 'var(--shadow-panel)' }"
        >
          <div>
            <div class="flex items-center gap-2">
              <span class="flex h-11 w-11 items-center justify-center rounded-lg" style="background: var(--accent-soft); color: var(--text-brand)">
                <AppWindow class="h-5 w-5" />
              </span>
              <UiBadge variant="secondary">{{ t('productsPage.office.layer') }}</UiBadge>
            </div>
            <h2 class="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{{ t('productsPage.office.name') }}</h2>
            <div class="mt-1 text-sm font-medium" style="color: var(--text-brand)">{{ t('productsPage.office.tagline') }}</div>
            <p class="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">{{ t('productsPage.office.desc') }}</p>
            <div class="mt-7">
              <router-link to="/products/tinadec-office">
                <UiButton size="lg">
                  {{ t('productsPage.office.cta') }}
                  <ArrowRight class="h-4 w-4" />
                </UiButton>
              </router-link>
            </div>
          </div>

          <TerminalWindow :title="`tinadec — ${t('hero.termTitle')}`" class="hidden sm:block">
            <div class="term-body space-y-1.5 text-xs sm:text-[13px]">
              <div class="term-line"><span class="select-none pr-3 text-[var(--accent-primary)]">❯</span><span class="text-[var(--text-primary)]">tinadec run "重构登录页为响应式布局"</span></div>
              <div class="term-line"><span class="select-none pr-3 text-[var(--text-muted)]">·</span><span class="text-[var(--text-muted)]">governance + execution 并行 · 写操作经过审批门</span></div>
              <div class="term-line"><span class="select-none pr-3 text-[var(--accent-success)]">✓</span><span class="text-[var(--accent-success)]">task graph · 3 节点已创建</span></div>
              <div class="term-line"><span class="select-none pr-3 text-[var(--accent-warning)]">⏳</span><span class="text-[var(--accent-warning)]">write_file · src/pages/Login.vue — 等待审批</span></div>
              <div class="term-line"><span class="select-none pr-3 text-[var(--accent-success)]">✓</span><span class="text-[var(--accent-success)]">apply_patch · +48 −12 · 12 tests passed</span></div>
            </div>
          </TerminalWindow>
        </article>

        <!-- 更多产品占位 -->
        <div class="mt-14">
          <div class="mb-3 text-xs font-semibold tracking-widest text-[var(--text-brand)] uppercase">{{ t('productsPage.comingTitle') }}</div>
          <div class="grid gap-5 sm:grid-cols-3">
            <div class="flex flex-col items-center rounded-xl border border-dashed p-8 text-center" style="border-color: var(--border-dashed)">
              <Hourglass class="mb-3 h-6 w-6" style="color: var(--text-muted)" />
              <div class="text-sm font-semibold text-[var(--text-secondary)]">{{ t('productsPage.comingSoon') }}</div>
            </div>
            <div class="flex flex-col items-center rounded-xl border border-dashed p-8 text-center" style="border-color: var(--border-dashed)">
              <Hourglass class="mb-3 h-6 w-6" style="color: var(--text-muted)" />
              <div class="text-sm font-semibold text-[var(--text-secondary)]">{{ t('productsPage.comingSoon') }}</div>
            </div>
            <router-link to="/architecture" class="flex flex-col items-center rounded-xl border p-8 text-center transition-all hover:-translate-y-0.5 hover:bg-[var(--surface-hover)]" style="border-color: var(--border-default); background: var(--surface-section)">
              <Boxes class="mb-3 h-6 w-6" style="color: var(--accent-primary)" />
              <div class="text-sm font-semibold">{{ t('productsPage.comingDesc') }}</div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <FinalCTA />
  </div>
</template>
