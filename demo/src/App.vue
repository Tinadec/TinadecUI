<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Sun, Moon, Bold, Italic, Underline, Check } from '@lucide/vue'
import {
  UiAlert,
  UiAvatar,
  UiBackgroundPreview,
  UiBadge,
  UiBreadcrumb,
  UiButton,
  UiCalendar,
  UiCard,
  UiChart,
  UiCheckbox,
  UiCollapsible,
  UiCommand,
  UiDropdownMenu,
  UiInput,
  UiLabel,
  UiMenubar,
  UiPagination,
  UiPopover,
  UiProgress,
  UiScrollArea,
  UiSelect,
  UiSeparator,
  UiSheet,
  UiSkeleton,
  UiSwitch,
  UiTable,
  UiTabs,
  UiTextarea,
  UiToggle,
  UiToggleGroup,
  UiTooltip,
} from '@tinadec/ui'

// ---------------------------------------------------------------------------
// Theme (tokens.css: .dark / [data-theme="dark"])
// ---------------------------------------------------------------------------
const isDark = ref(true)
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  refreshSwatches()
}

// ---------------------------------------------------------------------------
// Palette — runtime-resolved design tokens
// ---------------------------------------------------------------------------
const PALETTE: Array<[label: string, varName: string]> = [
  ['bg-primary', '--bg-primary'],
  ['bg-secondary', '--bg-secondary'],
  ['bg-tertiary', '--bg-tertiary'],
  ['bg-hover', '--bg-hover'],
  ['bg-selected', '--bg-selected'],
  ['bg-input', '--bg-input'],
  ['surface-chrome', '--surface-chrome'],
  ['surface-section', '--surface-section'],
  ['surface-raised', '--surface-raised'],
  ['surface-button', '--surface-button'],
  ['surface-input', '--surface-input'],
  ['surface-selected', '--surface-selected'],
  ['text-primary', '--text-primary'],
  ['text-secondary', '--text-secondary'],
  ['text-muted', '--text-muted'],
  ['text-brand', '--text-brand'],
  ['text-link', '--text-link'],
  ['text-error', '--text-error'],
  ['accent-primary', '--accent-primary'],
  ['accent-success', '--accent-success'],
  ['accent-warning', '--accent-warning'],
  ['accent-danger', '--accent-danger'],
  ['accent-info', '--accent-info'],
  ['border-default', '--border-default'],
  ['border-muted', '--border-muted'],
  ['border-input-focus', '--border-input-focus'],
  ['shadow-focus', '--shadow-focus'],
]

const swatchValues = ref<Record<string, string>>({})
function refreshSwatches() {
  const cs = getComputedStyle(document.documentElement)
  for (const [, varName] of PALETTE) {
    swatchValues.value[varName] = cs.getPropertyValue(varName).trim() || '—'
  }
}
onMounted(refreshSwatches)

// ---------------------------------------------------------------------------
// Demo interaction state
// ---------------------------------------------------------------------------
const checkboxVal = ref(true)
const switchVal = ref(true)
const inputVal = ref('')
const areaVal = ref('')
const progressVal = ref(68)
const tabVal = ref('workbench')
const toggleVal = ref('bold')
const selectVal = ref('')
const sheetOpen = ref(false)
const ddOpen = ref(false)
const popOpen = ref(false)
const collapsibleOpen = ref(true)
const tooltipVal = ref('')
const chartActive = ref(false)
</script>


<template>
  <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
    <!-- Header -->
    <header class="sticky top-0 z-40 border-b border-[var(--border-muted)] bg-[var(--bg-primary)]/85 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full bg-[var(--accent-brand)]" />
          <span class="text-sm font-semibold tracking-tight">@tinadec/ui</span>
          <span class="rounded-full border border-[var(--border-muted)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]">
            Design Gallery
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="hidden text-xs text-[var(--text-muted)] sm:inline">
            {{ isDark ? 'Dark' : 'Light' }}
          </span>
          <UiButton variant="outline" size="sm" @click="toggleTheme">
            <Sun v-if="isDark" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
            {{ isDark ? '切到亮色' : '切到暗色' }}
          </UiButton>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 pb-28 pt-12">
      <!-- Overview -->
      <section class="mb-14">
        <h1 class="text-3xl font-semibold tracking-tight md:text-4xl">
          TinadecUI
          <span class="chat-shimmer">Shadcn-style primitives</span>
        </h1>
        <p class="mt-3 max-w-2xl text-[var(--text-secondary)]">
          由 TinadecOffice 桌面端打磨而来的 Vue 组件原语，双层设计 token（shadcn HSL + Codex 语义变量），
          5 个组件为 Vapor SFC（Vue 3.6 RC 运行时），其余为经典运行时。
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <UiBadge variant="default">Vue 3.6</UiBadge>
          <UiBadge variant="secondary">Tailwind v4</UiBadge>
          <UiBadge variant="secondary">31 primitives</UiBadge>
          <UiBadge variant="outline">AGPL-3.0</UiBadge>
        </div>
      </section>

      <!-- Design tokens -->
      <section class="mb-14">
        <h2 class="mb-1 text-lg font-semibold tracking-tight">Design tokens</h2>
        <p class="mb-5 text-sm text-[var(--text-secondary)]">
          值取自 <code class="mono rounded bg-[var(--surface-section)] px-1.5 py-0.5 text-[12px]">--bg-*</code> /
          <code class="mono rounded bg-[var(--surface-section)] px-1.5 py-0.5 text-[12px]">--surface-*</code> /
          <code class="mono rounded bg-[var(--surface-section)] px-1.5 py-0.5 text-[12px]">--text-*</code> /
          <code class="mono rounded bg-[var(--surface-section)] px-1.5 py-0.5 text-[12px]">--accent-*</code>，
          随主题切换实时变化。
        </p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <div
            v-for="[label, varName] in PALETTE"
            :key="varName"
            class="rounded-lg border border-[var(--border-muted)] bg-[var(--surface-section)] p-3"
          >
            <div
              class="h-12 rounded-md border border-[var(--border-muted)]"
              :style="{ background: `var(${varName})` }"
            />
            <div class="mt-2 text-xs font-medium">{{ label }}</div>
            <div class="mono text-[11px] text-[var(--text-muted)]">{{ swatchValues[varName] }}</div>
          </div>
        </div>
      </section>

      <!-- Typography & radius -->
      <section class="mb-14 grid gap-6 md:grid-cols-2">
        <UiCard>
          <template #header>
            <div class="text-sm font-semibold">Typography — Geist Variable</div>
          </template>
          <div class="space-y-3">
            <div><div class="text-xs text-[var(--text-muted)]">Display</div><div class="text-4xl font-semibold tracking-tight">Agentic Workbench</div></div>
            <div><div class="text-xs text-[var(--text-muted)]">Heading</div><div class="text-xl font-semibold">让模型做其擅长的工作</div></div>
            <div><div class="text-xs text-[var(--text-muted)]">Body</div><div class="text-sm text-[var(--text-secondary)]">多智能体协作、授权治理、可解释运行、受控演化。</div></div>
            <div><div class="text-xs text-[var(--text-muted)]">Mono</div><div class="mono text-sm">@tinadec/ui — resolveDockDrop(pane, drop)</div></div>
          </div>
        </UiCard>
        <UiCard>
          <template #header>
            <div class="text-sm font-semibold">Radius & Shadows</div>
          </template>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-sm border border-[var(--border-default)] bg-[var(--surface-section)]" />
              <div class="h-10 w-10 rounded-md border border-[var(--border-default)] bg-[var(--surface-section)]" />
              <div class="h-10 w-10 rounded-lg border border-[var(--border-default)] bg-[var(--surface-section)]" />
              <div class="h-10 w-10 rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)]" />
              <div class="ml-2 text-xs text-[var(--text-muted)]">sm / md / lg / xl ← --radius 0.5rem</div>
            </div>
            <div class="flex items-end gap-3 pt-1">
              <div class="flex-1 rounded-lg bg-[var(--surface-section)] p-3" style="box-shadow: var(--shadow-subtle)">
                <div class="text-xs text-[var(--text-muted)]">shadow-subtle</div>
              </div>
              <div class="flex-1 rounded-lg bg-[var(--surface-section)] p-3" style="box-shadow: var(--shadow-panel)">
                <div class="text-xs text-[var(--text-muted)]">shadow-panel</div>
              </div>
              <div class="flex-1 rounded-lg bg-[var(--surface-section)] p-3" style="box-shadow: var(--shadow-elevated)">
                <div class="text-xs text-[var(--text-muted)]">shadow-elevated</div>
              </div>
            </div>
          </div>
        </UiCard>
      </section>

      <!-- Components: Buttons -->
      <section class="mb-12">
        <h2 class="mb-4 text-lg font-semibold tracking-tight">Buttons</h2>
        <div class="flex flex-wrap items-center gap-3">
          <UiButton>Primary</UiButton>
          <UiButton variant="secondary">Secondary</UiButton>
          <UiButton variant="outline">Outline</UiButton>
          <UiButton variant="ghost">Ghost</UiButton>
          <UiButton variant="destructive">Destructive</UiButton>
          <UiButton variant="link">Link</UiButton>
          <UiButton variant="outline" size="xs">xs</UiButton>
          <UiButton variant="outline" size="sm">sm</UiButton>
          <UiButton variant="outline" size="lg">lg</UiButton>
          <UiButton size="icon" variant="outline" aria-label="check">
            <Check class="h-4 w-4" />
          </UiButton>
          <UiButton disabled>Disabled</UiButton>
        </div>
      </section>

      <!-- Components: Badge / Toggle / ToggleGroup / Tabs -->
      <section class="mb-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 class="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Badge</h3>
          <div class="flex flex-wrap items-center gap-2">
            <UiBadge>Default</UiBadge>
            <UiBadge variant="secondary">Secondary</UiBadge>
            <UiBadge variant="destructive">Destructive</UiBadge>
            <UiBadge variant="outline">Outline</UiBadge>
          </div>
          <h3 class="mb-3 mt-6 text-sm font-semibold text-[var(--text-secondary)]">Toggle</h3>
          <div class="flex flex-wrap items-center gap-2">
            <UiToggle :pressed="toggleVal === 'bold'" variant="outline" @update:pressed="toggleVal = 'bold'">
              <Bold class="h-4 w-4" /> 粗体
            </UiToggle>
            <UiToggle :pressed="toggleVal === 'italic'" variant="outline" @update:pressed="toggleVal = 'italic'">
              <Italic class="h-4 w-4" /> 斜体
            </UiToggle>
            <UiToggle :pressed="toggleVal === 'underline'" variant="outline" @update:pressed="toggleVal = 'underline'">
              <Underline class="h-4 w-4" /> 下划线
            </UiToggle>
          </div>
          <div class="mt-4 text-xs text-[var(--text-muted)]">当前：{{ toggleVal || '未选择' }}</div>
        </div>

        <div>
          <h3 class="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Toggle group</h3>
          <UiToggleGroup v-model="toggleVal" class="flex">
            <template #default="{ toggle, activeValue }">
              <UiButton
                v-for="o in ['bold', 'italic', 'underline']"
                :key="o"
                size="sm"
                :variant="activeValue === o ? 'default' : 'ghost'"
                class="rounded px-4"
                @click="toggle(o)"
              >
                {{ { bold: '粗体', italic: '斜体', underline: '下划线' }[o] }}
              </UiButton>
            </template>
          </UiToggleGroup>

          <h3 class="mb-3 mt-6 text-sm font-semibold text-[var(--text-secondary)]">Tabs</h3>
          <UiTabs v-model="tabVal" class="w-full">
            <template #default="{ activeTab, setTab }">
              <button
                v-for="t in ['workbench', 'market', 'agents']"
                :key="t"
                class="px-3 py-1.5 text-sm font-medium transition-colors"
                :class="activeTab === t ? 'rounded-md bg-[var(--surface-selected)] text-[var(--text-brand)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'"
                @click="setTab(t)"
              >
                {{ { workbench: '工作台', market: '市场', agents: '智能体' }[t] }}
              </button>
            </template>
            <template #content="{ activeTab }">
              <div class="rounded-lg border border-[var(--border-muted)] bg-[var(--surface-section)] p-4 text-sm">
                {{
                  {
                    workbench: '工作台：任务编排、面板停靠、会话路由。',
                    market: '市场：组件/智能体市场与安装管理。',
                    agents: '智能体：多代理协同、授权与治理。',
                  }[activeTab] || ''
                }}
              </div>
            </template>
          </UiTabs>
        </div>
      </section>


      <!-- Components: Form controls -->
      <section class="mb-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 class="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Input / Label / Textarea</h3>
          <div class="space-y-4">
            <div>
              <UiLabel for="demo-input">工作区名称</UiLabel>
              <UiInput
                id="demo-input"
                v-model="inputVal"
                placeholder="例如：Agentic Research"
                class="mt-1.5"
              />
            </div>
            <div>
              <UiLabel for="demo-area">描述</UiLabel>
              <UiTextarea
                id="demo-area"
                v-model="areaVal"
                rows="3"
                placeholder="写下这段工作区要完成的任务…"
                class="mt-1.5"
              />
            </div>
            <div>
              <UiLabel for="demo-sel">技术栈</UiLabel>
              <div class="mt-1.5 max-w-xs">
                <UiSelect v-model="selectVal" placeholder="选择一个框架…">
                  <template #default="{ select, selectedValue }">
                    <div
                      v-for="o in ['Vue 3.6', 'Vite', 'Tailwind v4', 'Vapor']"
                      :key="o"
                      class="flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-[var(--surface-hover)]"
                      @click="select(o)"
                    >
                      <span>{{ o }}</span>
                      <span v-if="selectedValue === o" class="text-[var(--text-brand)]">✓</span>
                    </div>
                  </template>
                </UiSelect>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Switch / Checkbox / Progress / Skeleton</h3>
          <div class="flex items-center justify-between rounded-lg border border-[var(--border-muted)] bg-[var(--surface-section)] px-4 py-3">
            <div>
              <div class="text-sm font-medium">启用 Vapor 运行时</div>
              <div class="text-xs text-[var(--text-muted)]">badge / label / progress / separator / skeleton</div>
            </div>
            <UiSwitch v-model="switchVal" />
          </div>
          <div class="mt-3 flex items-center gap-3">
            <UiCheckbox v-model="checkboxVal" />
            <span class="text-sm">{{ checkboxVal ? '已勾选：AI 记忆持久化' : '未勾选：AI 记忆持久化' }}</span>
          </div>
          <div class="mt-5">
            <div class="mb-1.5 flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>任务执行进度</span><span>{{ progressVal }}%</span>
            </div>
            <UiProgress :model-value="progressVal" />
          </div>
          <div class="mt-5 flex items-center gap-3">
            <UiSkeleton class="h-10 w-10 rounded-full" />
            <div class="flex-1 space-y-2">
              <UiSkeleton class="h-3 w-3/4" />
              <UiSkeleton class="h-3 w-1/2" />
            </div>
            <UiSkeleton class="h-8 w-24 rounded-md" />
          </div>
          <UiSeparator class="my-6" />
          <div class="flex h-12 items-center gap-4">
            <span class="text-xs text-[var(--text-muted)]">纵向分隔线</span>
            <UiSeparator orientation="vertical" class="h-6" />
            <span class="text-xs text-[var(--text-muted)]">视觉分组</span>
          </div>
        </div>
      </section>


      <!-- Components: Overlays -->
      <section class="mb-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 class="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Tooltip</h3>
          <div class="flex flex-wrap items-center gap-3">
            <UiTooltip content="顶部提示：在仓库中打开">
              <UiButton variant="outline" size="sm">悬停我</UiButton>
            </UiTooltip>
            <UiTooltip :content="tooltipVal || '默认文案'">
              <UiButton variant="ghost" size="sm" @click="tooltipVal = '已点击，下次悬停看这个'">
                换文案
              </UiButton>
            </UiTooltip>
          </div>

          <h3 class="mb-3 mt-8 text-sm font-semibold text-[var(--text-secondary)]">Popover</h3>
          <UiPopover v-model:open="popOpen" class="w-64">
            <template #trigger>
              <UiButton variant="outline" size="sm">打开 Popover</UiButton>
            </template>
            <div class="space-y-2">
              <div class="text-sm font-medium">画布设置</div>
              <div class="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>网格吸附</span>
                <UiSwitch v-model="checkboxVal" />
              </div>
              <div class="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>迷你地图</span>
                <UiSwitch v-model="switchVal" />
              </div>
            </div>
          </UiPopover>

          <h3 class="mb-3 mt-8 text-sm font-semibold text-[var(--text-secondary)]">Dropdown menu</h3>
          <UiDropdownMenu v-model:open="ddOpen">
            <template #trigger>
              <UiButton variant="secondary" size="sm">菜单</UiButton>
            </template>
            <div class="flex flex-col p-1">
              <button class="rounded px-2.5 py-1.5 text-left text-sm hover:bg-[var(--surface-hover)]">重命名</button>
              <button class="rounded px-2.5 py-1.5 text-left text-sm hover:bg-[var(--surface-hover)]">复制链接</button>
              <UiSeparator class="my-1" />
              <button class="rounded px-2.5 py-1.5 text-left text-sm text-[var(--text-error)] hover:bg-[var(--surface-hover)]">
                删除工作区
              </button>
            </div>
          </UiDropdownMenu>
        </div>

        <div>
          <h3 class="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Collapsible</h3>
          <UiCollapsible v-model:open="collapsibleOpen">
            <template #trigger>
              <UiButton variant="outline" size="sm">
                {{ collapsibleOpen ? '收起 — 面板大纲' : '展开 — 面板大纲' }}
              </UiButton>
            </template>
            <div class="mt-3 space-y-1 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-section)] p-3 text-sm">
              <div>· 顶部工具条</div>
              <div>· 左部导航树</div>
              <div>· 中央画布</div>
              <div>· 右部属性面板</div>
            </div>
          </UiCollapsible>

          <h3 class="mb-3 mt-8 text-sm font-semibold text-[var(--text-secondary)]">Command</h3>
          <UiCommand class="max-w-sm">
            <template #default>
              <button class="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)]">
                <span class="h-4 w-4 rounded-sm border border-[var(--border-default)]" /> 新建工作区
              </button>
              <button class="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)]">
                <span class="h-4 w-4 rounded-sm border border-[var(--border-default)]" /> 打开市场
              </button>
              <button class="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)]">
                <span class="h-4 w-4 rounded-sm border border-[var(--border-default)]" /> 切换主题
              </button>
            </template>
          </UiCommand>

          <h3 class="mb-3 mt-8 text-sm font-semibold text-[var(--text-secondary)]">Sheet</h3>
          <UiButton variant="outline" size="sm" @click="sheetOpen = true">打开右侧 Sheet</UiButton>
          <UiSheet v-model:open="sheetOpen">
            <div class="space-y-3">
              <h4 class="text-base font-semibold">面板属性</h4>
              <p class="text-sm text-[var(--text-secondary)]">从右侧滑出的设置抽屉，点击遮罩或右上角 × 关闭。</p>
              <div>
                <UiLabel for="sheet-input">面板名称</UiLabel>
                <UiInput id="sheet-input" v-model="inputVal" placeholder="未命名面板" class="mt-1.5" />
              </div>
            </div>
          </UiSheet>
        </div>
      </section>


      <!-- Components: Navigation & data -->
      <section class="mb-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 class="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Menubar / Breadcrumb / Pagination</h3>
          <UiMenubar class="w-fit">
            <UiButton variant="ghost" size="sm">文件</UiButton>
            <UiButton variant="ghost" size="sm">编辑</UiButton>
            <UiButton variant="ghost" size="sm">视图</UiButton>
            <UiButton variant="ghost" size="sm">帮助</UiButton>
          </UiMenubar>

          <UiBreadcrumb class="mt-4">
            <a class="hover:text-[var(--text-brand)]" href="#">工作台</a>
            <span class="opacity-50">/</span>
            <a class="hover:text-[var(--text-brand)]" href="#">Agentic Research</a>
            <span class="opacity-50">/</span>
            <span class="text-[var(--text-brand)]">编排</span>
          </UiBreadcrumb>

          <UiPagination class="mt-4">
            <li><UiButton variant="outline" size="sm">上一页</UiButton></li>
            <li><UiButton variant="default" size="sm">1</UiButton></li>
            <li><UiButton variant="ghost" size="sm">2</UiButton></li>
            <li><UiButton variant="ghost" size="sm">3</UiButton></li>
            <li><UiButton variant="ghost" size="sm">…</UiButton></li>
            <li><UiButton variant="outline" size="sm">下一页</UiButton></li>
          </UiPagination>

          <h3 class="mb-3 mt-8 text-sm font-semibold text-[var(--text-secondary)]">Avatar / Alert</h3>
          <div class="flex items-center gap-3">
            <UiAvatar class="bg-[var(--surface-selected)] text-[var(--text-brand)]">TM</UiAvatar>
            <UiAvatar class="bg-[var(--surface-section)] text-[var(--text-secondary)]">AG</UiAvatar>
            <UiAvatar class="bg-[var(--surface-section)] text-[var(--text-secondary)]">UI</UiAvatar>
          </div>
          <UiAlert variant="default" class="mt-4">
            <div>
              <div class="font-medium">Agentic Research</div>
              <div class="text-[var(--text-secondary)]">有 3 个子代理正在协作，最新产物 2 分钟前落地。</div>
            </div>
          </UiAlert>
          <UiAlert variant="destructive" class="mt-3">
            <div>
              <div class="font-medium">令牌配额不足</div>
              <div class="text-[var(--text-error)]">请前往「设置 → 账单」扩容后再试。</div>
            </div>
          </UiAlert>
        </div>

        <div>
          <h3 class="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Table / ScrollArea</h3>
          <UiTable class="rounded-lg border border-[var(--border-muted)]">
            <thead class="bg-[var(--surface-section)] text-left text-xs text-[var(--text-muted)]">
              <tr>
                <th class="px-4 py-2 font-medium">任务</th>
                <th class="px-4 py-2 font-medium">代理</th>
                <th class="px-4 py-2 font-medium">状态</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="border-t border-[var(--border-muted)]">
                <td class="px-4 py-2">检索论文库</td><td class="px-4 py-2">Researcher</td>
                <td class="px-4 py-2"><UiBadge variant="secondary">进行中</UiBadge></td>
              </tr>
              <tr class="border-t border-[var(--border-muted)]">
                <td class="px-4 py-2">归纳结论</td><td class="px-4 py-2">Synthesizer</td>
                <td class="px-4 py-2"><UiBadge variant="default">已完成</UiBadge></td>
              </tr>
              <tr class="border-t border-[var(--border-muted)]">
                <td class="px-4 py-2">生成报告</td><td class="px-4 py-2">Writer</td>
                <td class="px-4 py-2"><UiBadge variant="destructive">失败</UiBadge></td>
              </tr>
            </tbody>
          </UiTable>


          <UiScrollArea class="mt-4 h-32 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-section)]">
            <div class="space-y-2 p-3 text-sm text-[var(--text-secondary)]">
              <p v-for="n in 10" :key="n">运行日志 #{{ n }}：面板 {{ 'ABC'[n % 3] }} 就绪，心跳正常。</p>
            </div>
          </UiScrollArea>

          <h3 class="mb-3 mt-8 text-sm font-semibold text-[var(--text-secondary)]">Calendar / Chart</h3>
          <div class="grid grid-cols-2 gap-3">
            <UiCalendar class="rounded-lg border border-[var(--border-muted)] bg-[var(--surface-section)]">
              <div class="grid grid-cols-7 gap-1 text-center text-xs">
                <div v-for="d in ['一','二','三','四','五','六','日']" :key="d" class="py-1 text-[var(--text-muted)]">{{ d }}</div>
                <div v-for="d in 28" :key="d" class="rounded py-1" :class="d === 16 ? 'bg-[var(--surface-selected)] text-[var(--text-brand)]' : 'hover:bg-[var(--surface-hover)]'">
                  {{ d }}
                </div>
              </div>
            </UiCalendar>
            <div>
              <UiChart class="h-full p-4">
                <div class="flex h-28 items-end gap-1.5">
                  <div v-for="(h, i) in [30, 55, 40, 72, 62, 88, 45]" :key="i"
                    class="flex-1 rounded-t" :class="i === 5 ? 'bg-[var(--accent-brand)]' : 'bg-[var(--accent-soft)]'"
                    :style="{ height: h + '%' }" />
                </div>
                <div class="mt-2 text-center text-xs text-[var(--text-muted)]">过去 7 日任务量</div>
              </UiChart>
            </div>
          </div>
        </div>
      </section>

      <!-- Components: Background preview -->
      <section class="mb-12">
        <h2 class="mb-4 text-lg font-semibold tracking-tight">Background preview</h2>
        <div class="max-w-xl">
          <UiBackgroundPreview
            :settings="{
              type: 'html',
              source: '<div style=&quot;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:16px&quot;><div style=&quot;height:40px;border-radius:8px;background:var(--accent-soft);border:1px solid var(--border-muted)&quot;></div><div style=&quot;height:40px;border-radius:8px;background:var(--surface-section);border:1px solid var(--border-muted)&quot;></div><div style=&quot;height:40px;border-radius:8px;background:var(--surface-raised);border:1px solid var(--border-muted)&quot;></div><div style=&quot;height:40px;border-radius:8px;background:var(--surface-selected)&quot;></div></div>',
              opacity: 40,
              blur: 8,
              size: 'cover',
              position: 'center',
              repeat: 'no-repeat',
            }"
            :height="160"
            class="rounded-xl border border-[var(--border-muted)]"
          />
          <div class="mt-2 text-xs text-[var(--text-muted)]">
            type=html · opacity 40 · blur 8px —— 由桌面端「设置 → 背景」面板复用的实时预览。
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-[var(--border-muted)] pt-6 text-center text-xs text-[var(--text-muted)]">
        @tinadec/ui · TinadecUI · 31 primitives · Vapor 5 个 · 与官网同版本 Vue 3.6
      </footer>
    </main>
  </div>
</template>

