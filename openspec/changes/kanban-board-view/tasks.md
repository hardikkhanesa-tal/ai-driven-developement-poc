## 1. Logic layer

- [ ] 1.1 Add `groupByStatus(todos: Todo[]): Record<KanbanStatus, Todo[]>` to `src/logic/` (new file, e.g. `groupByStatus.ts`), mirroring the pattern of `filter.ts`/`sort.ts`
- [ ] 1.2 Unit test `groupByStatus`: todos land in the right bucket, buckets default to empty arrays when no todo matches

## 2. Board components

- [ ] 2.1 Create `KanbanColumn` component: renders a column heading + list of card components for one status
- [ ] 2.2 Create `KanbanBoard` component: takes visible todos, calls `groupByStatus`, renders one `KanbanColumn` per `KanbanStatus`
- [ ] 2.3 Add card rendering inside `KanbanColumn` (reuse or extract from `TodoItem` — decide extraction vs. duplication per design.md open question)
- [ ] 2.4 Wire `onStatusChange`/`setStatus` dispatch from card move actions up through `KanbanColumn` → `KanbanBoard` → `App.tsx`

## 3. Move interactions

- [ ] 3.1 Add native HTML5 drag-and-drop: `draggable` on cards, `onDragStart` (store dragged todo id), `onDragOver`/`onDrop` on columns (dispatch `setStatus` with column's status)
- [ ] 3.2 Add non-drag fallback move control on each card (e.g. a small "Move to" select/menu) that dispatches the same `setStatus` action
- [ ] 3.3 Verify dropping a card on "Done" sets `done: true` via existing reducer behavior (no reducer change needed)

## 4. View toggle

- [ ] 4.1 Add `viewMode: 'list' | 'board'` local state in `App.tsx`
- [ ] 4.2 Add a toggle control (e.g. segmented button) to switch `viewMode`
- [ ] 4.3 Render `TodoList` or `KanbanBoard` based on `viewMode`, passing the same filtered/sorted/visible todos to both

## 5. Tests & verification

- [ ] 5.1 Component test: switching views preserves the visible todo set (same filter/search/sort applied)
- [ ] 5.2 Component test: moving a card (drag simulate or fallback control) dispatches `setStatus` with correct id/status
- [ ] 5.3 Manual check in browser: drag between all three columns, use fallback control, confirm persistence across reload (existing localStorage save/load, unchanged)
