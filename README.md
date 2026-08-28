# TinadecUI

## 技术栈

| 项 | 版本/说明 |
| --- | --- |
| Vue | `3.6.0-rc.2`（含 Vapor SFC 运行时） |
| 样式 | Tailwind CSS v4（`@tailwindcss/vite`） |
| 组件模式 | shadcn 风格（`class-variance-authority` + `clsx` + `tailwind-merge`） |
| 图标 | `@lucide/vue` |
| 国际化 | `vue-i18n`（`background-preview` 依赖） |
| 字体 | `@fontsource-variable/geist`、`@fontsource-variable/geist-mono` |

> `.npmrc` 需保留 `legacy-peer-deps=true`：`@lucide/vue` 的 peer `vue>=3.0.1`
> 在 npm 严格规则下不匹配 prerelease `3.6.0-rc.2`。

## 包结构

```
src/
├── index.ts                 # 入口：engine + components
├── components/
│   ├── index.ts             # useUie + ui primitives
│   ├── useUie.ts            # useUie / ui() 工程辅助（干净，可独立使用）
│   └── ui/                  # 31 个 Ui* 原语（自包含，只依赖 ../../lib/utils）
├── engine/                  # 布局引擎（TinadecUIE）
├── lib/
│   ├── utils.ts             # cn()
│   └── vue-shim.ts          # Vue 3.6 双运行时 shim（Vapor + 经典）
├── styles/
│   ├── tokens.css           # 双层设计 token（shadcn + Codex 语义）
│   └── fonts.css            # Geist 字体入口
├── assets/                  # 静态资源
└── types/background.ts      # 背景设置类型（background-preview 依赖）

demo/                        # 交互式画廊（自带 Vite，端口 5191）
```

## 原语清单（31 个）

`alert, avatar, background-preview, badge, breadcrumb, button, calendar, card, chart,
checkbox, collapsible, command, dropdown-menu, input, label, menubar, pagination, popover,
progress, scroll-area, select, separator, sheet, skeleton, switch, table, tabs, textarea,
toggle, toggle-group, tooltip`

- **Vapor SFC（5 个）**：`badge` `label` `progress` `separator` `skeleton`
- **排除（1 个）**：`panel-style-control.vue` —— 依赖桌面内部 `@/composables/usePanelStyles`，与桌面业务强耦合
- `@/lib/utils` 已在搬运时改写为 `../../lib/utils`

## 消费方式（官网 / demo）

`package.json` 以 `file:` 引用本地包：

```json
"dependencies": { "@tinadec/ui": "file:../TinadecUI" }
```

Vite 需把 `vue` 指到包的 shim，并显式解析双运行时：

```ts
resolve: {
  alias: {
    vue: path.resolve(UI_ROOT, 'src/lib/vue-shim.ts'),
    '@vue/reactivity': path.resolve(uiRoot, 'node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js'),
    '@vue/runtime-dom': path.resolve(uiRoot, 'node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js'),
    '@vue/runtime-vapor': path.resolve(uiRoot, 'node_modules/@vue/runtime-vapor/dist/runtime-vapor.esm-bundler.js'),
  },
  dedupe: ['vue', '@vue/reactivity', '@vue/runtime-dom', '@vue/runtime-vapor'],
}
```

入口挂载 vaporInteropPlugin：

```ts
import { createApp } from 'vue'
import * as Vue from 'vue'
const plugin = (Vue as any).vaporInteropPlugin
const app = createApp(App)
if (plugin) app.use(plugin)
```

样式（Tailwind v4）需显式收集包内类：

```css
@import "tailwindcss";
@import "@tinadec/ui/styles/fonts.css";
@import "@tinadec/ui/styles/tokens.css";
@source "../node_modules/@tinadec/ui/src";
```

## 运行与验证

```bash
# 组件库依赖
cd TinadecUI && npm install

# 画廊（dev / build）
cd TinadecUI/demo && npm install
npm run dev      # http://localhost:5191
npm run build

# 官网
cd TinadecOfficalWeb
npx vue-tsc --noEmit
npm run build
```

## 设计规范

见 [`design.md`](./design.md)。
