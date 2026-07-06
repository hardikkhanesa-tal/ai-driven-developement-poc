# Todo App — Design Spec

**Date:** 2026-07-06
**Status:** Approved (design), pending deploy-checklist + implementation plan

## Purpose

A robust, single-user todo web application with a playful, colorful modern UI.
Runs entirely in the browser with no backend; data persists in localStorage.

## Scope

In scope:
- Add / complete / edit / delete todos
- Priority levels (high / med / low)
- Due dates with in-app visual reminders (overdue / due-soon highlighting + badge counts)
- Tags / categories (free-form labels)
- Search (title text) + filter (status / priority / tag)
- Playful colorful UI with light/dark toggle

Out of scope (YAGNI):
- Multi-user, auth, accounts
- Backend / server / cloud sync
- OS/browser push notifications
- Recurring todos, subtasks, attachments

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- Vitest for unit tests (logic layer)

## Architecture

Three isolated layers:

```
UI (React components)
  App · TodoList · TodoItem · TodoForm · FilterBar · SearchBox · TagPicker · ThemeToggle
State (custom hook: useTodos wrapping reducer + localStorage sync)
Pure logic (no React deps) — TDD target
  todoReducer · filterTodos · searchTodos · sortTodos · dateStatus · storage
```

Rationale: the pure logic layer has zero React dependencies, so it is fast to
unit test and supports strict RED-GREEN-REFACTOR. UI components stay thin and
delegate all behavior to the state hook and logic functions.

## Data Model

```ts
type Priority = 'high' | 'med' | 'low';

interface Todo {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  dueDate?: string;   // ISO date string, optional
  tags: string[];
  createdAt: string;  // ISO datetime string
}

interface AppState {
  todos: Todo[];
  filter: { status: 'all' | 'active' | 'done'; priority?: Priority; tag?: string };
  search: string;
  sort: 'priority' | 'dueDate' | 'created';
  theme: 'light' | 'dark';
}
```

## Logic Layer (units)

- `todoReducer(state, action)` — pure reducer. Actions: `add`, `toggle`, `edit`,
  `delete`, `setFilter`, `setSearch`, `setSort`, `setTheme`.
- `filterTodos(todos, filter)` — apply status/priority/tag filters.
- `searchTodos(todos, query)` — case-insensitive title match.
- `sortTodos(todos, sort)` — order by priority, due date, or created time.
- `dateStatus(dueDate, now)` — returns `'overdue' | 'due-soon' | 'upcoming' | 'none'`.
- `storage.load()` / `storage.save(state)` — serialize to/from localStorage with
  corrupt-data fallback.

## Feature Mapping

- **Priority** → colored left-border on card + sort-by-priority option.
- **Due dates** → `dateStatus()` drives visual highlight (overdue = red, due-soon
  = amber) + badge counts. In-app only, no OS notifications.
- **Tags** → free-form labels, rendered as chips, filterable.
- **Search + filter** → text match on title combined with status/priority/tag
  filters, all client-side.

## UI / Visual Style

Playful colorful: bold accent palette, rounded cards, tag chips, subtle
add/complete animations, priority color coding, light/dark theme toggle.

## Error / Edge Handling

- Corrupt or missing localStorage → catch parse error, fall back to empty list.
- Empty states → friendly empty-list message; distinct "no matches" for filters.
- Invalid due date → treated as no date.
- Title validation → trim; reject blank/whitespace-only.

## Testing Plan (Vitest, logic layer)

- `todoReducer` — every action.
- `filterTodos` / `searchTodos` — status, priority, tag, text combinations.
- `sortTodos` — by priority, due date, created.
- `dateStatus` — overdue / due-soon / upcoming / none boundaries.
- `storage` — serialize/deserialize round-trip + corrupt-data fallback.

Strict TDD: failing test first, minimal code to pass, refactor, commit.

## Deployment Considerations

- **Environments:** Local dev only for now (`vite dev` / `vite build`). No
  staging/prod hosting yet. No environment-specific config.
- **Migrations:** None. State is client-side in localStorage. Schema changes
  handled by `storage.load()` corrupt/mismatch fallback (bad or old-shaped data
  → empty list), so no formal migration needed.
- **Feature flags:** None. Ship all-at-once; single-user local app.
- **Dependencies:** No new external services, secrets, or env vars. Only npm
  dev-dependencies (React, Vite, TypeScript, Tailwind, Vitest).
- **Rollback:** Git revert / rebuild previous version. No live infra to roll back.
- **Monitoring:** None (no server). Local console errors only.
- **Downtime:** None applicable.

Future hosting (static host / container) is out of scope for this iteration and
would be a separate spec.
