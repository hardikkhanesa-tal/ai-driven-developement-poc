## Why

Todos already carry a `status` field (`todo` / `in-progress` / `done`) editable via a per-item dropdown, but the app still renders as a single flat list. Users managing active work want a Kanban board — three columns by status, drag-and-drop (or button-based move) between them — to see and manage work-in-progress at a glance.

## What Changes

- Add a board view: three columns (`To Do`, `In Progress`, `Done`) rendering todos grouped by `status`.
- Add a view toggle (List / Board) so the existing list view remains available.
- Support moving a todo between columns (drag-and-drop with a keyboard/button fallback) which dispatches the existing `setStatus` action.
- Preserve existing filter/search/sort controls; they apply to which todos appear on the board, same as they do for the list.
- No changes to persisted data shape — `status` already exists on `Todo`.

## Capabilities

### New Capabilities
- `kanban-board`: Board view rendering todos in status columns with drag-and-drop / fallback move controls, wired to the existing `setStatus` action.

### Modified Capabilities
(none — no existing spec-level requirements change; this adds a new view on top of existing todo/status behavior)

## Impact

- New components: board container + column + draggable card (likely under `src/components/`).
- `App.tsx`: add view-mode state and toggle control, conditionally render List or Board.
- No changes to `src/logic/types.ts`, `todoReducer.ts`, or `storage.ts` — reuses `KanbanStatus`, `setStatus` action, and existing persistence.
- No new dependencies required if drag-and-drop fallback uses native HTML5 DnD; a DnD library is a design-time decision, not a proposal-time one.
