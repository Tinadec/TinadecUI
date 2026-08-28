# TinadecUI — Design 规范

本文描述 `@tinadec/ui` 的设计 token 与组件约定。全部 token 集中在
`src/styles/tokens.css`，demo 画廊中可实时查看并切换亮/暗主题。

## 1. 双层 token 体系

token 分两层，全部为 CSS 变量：

1. **shadcn 层**（`--background` `--foreground` `--primary` `--border` `--ring` `--radius` …）
   —— 供 Tailwind 工具类（`bg-primary` `text-muted-foreground` `border-border`）直接消费，
   并通过 `--color-*` 映射进 Tailwind 的 theme 命名空间。
2. **Codex 语义层**（`--bg-*` `--surface-*` `--text-*` `--accent-*` `--border-*` `--shadow-*`）
   —— 表达应用级语义（背景层级、表面状态、文本层级、强调色、阴影层级），
   原语内以 `bg-[var(--surface-raised)]` 形式引用。

### 1.1 shadcn → 语义映射表

| 语义变量 | Light | Dark |
| --- | --- | --- |
| `--background` | `#ffffff` | `#0a0e14` |
| `--foreground` | `#1f2328` | `#e6edf3` |
| `--primary` | `#1f6f68` | `#2ec4b6` |
| `--primary-foreground` | `#ffffff` | `#0a0e14` |
| `--muted-foreground` | `#7a8390` | `#9ea7b3` |
| `--border` | `#d0d7de` | `#2d333b` |
| `--ring` | `#1f8f80` | `#2ec4b6` |
| `--destructive` | `#cf222e` | `#f85149` |
| `--radius` | `0.5rem` | `0.5rem` |

### 1.2 语义层分类

**背景层级**（`--bg-*`）：
`bg-primary`（页面底）→ `bg-secondary`（区块）→ `bg-tertiary`（更深/内嵌）→ `bg-hover` → `bg-selected` → `bg-input` → `bg-overlay`。

**表面状态**（`--surface-*`）：
`surface-chrome`（应用骨架）· `surface-section`（内容区块）· `surface-raised`（浮层/卡片）·
`surface-hover` · `surface-active` · `surface-selected` · `surface-input`（输入底）·
`surface-button` / `surface-button-hover`。

**文本层级**（`--text-*`）：
`text-primary`（正文）· `text-secondary` · `text-muted`（弱化）· `text-brand`（品牌/强调）·
`text-link` · `text-error`。派生：`--text-chat-muted`（会话弱化文本）。

**强调色**（`--accent-*`）：
`accent-primary` · `accent-success` · `accent-warning` · `accent-danger` · `accent-info` ·
`accent-brand` · `accent-soft`（主色 10~12% 透明底）。

**边框**（`--border-*`）：
`border-default` · `border-muted` · `border-input` · `border-input-focus` · `border-error` · `border-dashed`。

**阴影层级**（`--shadow-*`）：
`shadow-subtle` → `shadow-panel` → `shadow-elevated` → `shadow-focus`（焦点环）→
`shadow-user-msg` / `shadow-card-subtle` / `shadow-card-hover`。

## 2. 主题

- 亮色：`:root` 默认值。
- 暗色：`.dark, [data-theme="dark"]` 选择器覆盖（demo 与官网通过切换 `<html>` 的 `dark` 类生效）。
- 强调色跟随 `--ring` 与 `--accent-brand` 联动：亮色 `#1f8f80`、暗色 `#2ec4b6`（Teal 系）。

## 3. 排版与字体

- 主字体 **Geist Variable**（`@fontsource-variable/geist`）；等宽 **Geist Mono Variable**
  （`@fontsource-variable/geist-mono`）。
- 由 `src/styles/fonts.css` 统一引入，消费方只需 `@import "@tinadec/ui/styles/fonts.css"`。
- 尺度建议：正文 14–15px / 标题语义加粗 / 标题字号按需（demo 展示 Display–Body–Mono 四级）。

## 4. 圆角

以 `--radius: 0.5rem` 为基准派生：

| 工具类 | 计算 |
| --- | --- |
| `rounded-sm` | `calc(var(--radius) - 4px)` |
| `rounded-md` | `calc(var(--radius) - 2px)` |
| `rounded-lg` | `var(--radius)` |
| `rounded-xl` | `calc(var(--radius) + 4px)` |

## 5. 动效 token

- `--chat-shimmer-*`：会话加载骨架的流光效果（`.chat-shimmer`）。
- `@keyframes chat-shimmer-sweep` / `chat-status-rise`：会话状态进入动画。
- 原语内的交互反馈统一使用 Tailwind `transition-colors` + `animate-pulse`。

## 6. 组件约定

- **命名**：`Ui` + PascalCase（`UiButton`、`UiDropdownMenu`），默认导出同名组件文件。
- **变体**：`class-variance-authority` 管理 `variant` / `size`（如 `button.vue` 的 6 种 variant、
  5 种 size）。
- **状态**：受控 `modelValue` / `pressed` / `open` + `update:*` 事件，配合 `watch` 同步外部值。
- **组合**：容器型组件（`tabs` `toggle-group` `select` `dropdown-menu` `collapsible` `popover`）
  通过 **slot props** 暴露内部方法（`setTab` / `toggle` / `select` / `activeTab`）。
- **样式引用**：原语一律用语义变量（`var(--surface-*)`）或 Tailwind 语义类（`bg-primary`），
  不硬编码色值。
- **Vapor**：`badge` `label` `progress` `separator` `skeleton` 为 Vapor SFC（`<template vapor>`），
  需 Vue `3.6.0-rc.2` 运行时（见 README 的 vue-shim 配置）。

## 7. 原语依赖边界

- 所有原语只依赖 `../../lib/utils` 的 `cn()` 与第三方包（`class-variance-authority`、
  `@lucide/vue`、`vue`、`vue-i18n`），**不依赖**桌面内部模块（`@/composables`、`vue-router` 等）。
- 因此 `panel-style-control.vue`（依赖 `usePanelStyles`）被排除在本库之外。
