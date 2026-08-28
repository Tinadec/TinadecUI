// TinadecUI — Components module public barrel.
//
// The UI library: the reactive store (`useUie`), the card registry, and the
// shadcn-style primitives (Ui*). Everything here depends one-way on the
// Engine module (`src/engine`) — it never mutates layout state directly, only
// through `commandBus.dispatch`.
//
// NOTE (standalone build): the `UieShell/UieCanvas/UieColumn/UieStack/UieDock/
// UieCardHost/UieCardFrame` render components and the `cards/` registry are
// desktop-coupled (they import `@/composables/*`, `@/controllers/*`, etc. that
// only exist inside TinadecOffice's apps/desktop), so they are NOT re-exported
// from this standalone package build. TinadecOffice keeps its own copies and
// imports them through its in-repo vite alias / tsconfig paths.

// --- Reactive store ---
export * from './useUie'

// --- shadcn-style primitives (Ui*) ---
export * from './ui'

