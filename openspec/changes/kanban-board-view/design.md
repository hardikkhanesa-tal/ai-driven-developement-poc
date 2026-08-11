## Context

App is a React/TS/Vite todo app, 3-layer: `logic` (reducer/types/pure functions) → state (`useTodos` hook) → `components` (UI). `Todo.status: KanbanStatus` and the `setStatus` action already exist and are exercised by a per-item `<select>` in `TodoItem`. There is no board layout; all todos render as one `TodoList`.

## Goals / Non-Goals

**Goals:**
- Render todos as three status columns (`todo`, `in-progress`, `done`).
- Let a user move a card to a different column, dispatching `setStatus`.
- Let a user switch between List and Board views without losing filter/search/sort state.

**Non-Goals:**
- No new persisted fields — reuse `Todo.status` and `setStatus` as-is.
- No column reordering, WIP limits, or per-column sort overrides — out of scope for v1.
- No server sync / multi-user concerns — app is single-user, localStorage-backed, unchanged.

## Decisions

- **Drag-and-drop mechanism: native HTML5 DnD (`draggable`, `onDragStart`/`onDrop`), not a library.**
  Alternative considered: `@dnd-kit` or `react-beautiful-dnd`. Rejected for v1 — native DnD covers the 3-column move case with zero new dependencies (ponytail: already-installed-deps rung wins; add a library only if v1 native DnD proves too limited, e.g. touch-device support).
  Every draggable card also gets a keyboard-accessible fallback (a small "Move to ▸" menu or arrow buttons) so DnD is not the only path — native HTML5 DnD has no built-in keyboard/touch support.

- **Board is a new component tree, not a rewrite of `TodoList`/`TodoItem`.**
  `KanbanBoard` groups the already-filtered/sorted todo array by `status` into three arrays, then renders one `KanbanColumn` per status, reusing `TodoItem`-level card rendering (extracted or duplicated minimally) inside each column. `TodoList` (flat view) stays untouched.
  Alternative considered: make `TodoList` itself mode-aware. Rejected — would couple an unrelated concern (layout mode) into a component whose job is just "render this array of todos."

- **View-mode state (`'list' | 'board'`) lives in local component state in `App.tsx`, not in `AppState`/reducer/localStorage.**
  It's a display preference, not data. Alternative considered: persist it via `storage.ts`. Deferred — no requirement asked for persistence across reloads; add later if users want it sticky.

- **Grouping by status happens in a new pure function in `src/logic/` (e.g. `groupByStatus(todos): Record<KanbanStatus, Todo[]>`), not inline in the component.**
  Keeps the 3-layer separation (pure logic function, unit-testable, mirrors existing `filter.ts`/`sort.ts` pattern) instead of putting grouping logic in JSX.

## Risks / Trade-offs

- [Native HTML5 DnD has inconsistent touch-device support] → Mitigate with the button/menu-based move fallback on every card; DnD is progressive enhancement, not the only way to move a card.
- [Adding a third layout mode increases `App.tsx` branching] → Mitigate by keeping the branch to a single `viewMode === 'board' ? <KanbanBoard/> : <TodoList/>` swap; no duplicated filter/search/sort wiring.
- [Column card is visually/behaviorally similar to `TodoItem` but not identical (drag handle, no inline due-date badge layout)] → Decide at implementation time whether to extract a shared `TodoCard` presentational component or accept minor duplication; not a spec-level concern.

## Migration Plan

No data migration — `status` field and `setStatus` action are already live (see existing storage backfill for legacy todos without `status`). Rollout is additive: ship `KanbanBoard` + view toggle behind no flag (low risk, purely additive UI); default view stays List. Rollback = revert the component/toggle addition, no data cleanup needed.

## Open Questions

- Should view-mode preference persist across reloads? (Deferred to a follow-up if requested.)
- Should a card be draggable within a column to set manual order, or is column membership (status) the only orderable dimension for v1? (Assumed: status-only, no intra-column reordering.)
