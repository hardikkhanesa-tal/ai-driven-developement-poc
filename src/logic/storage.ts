import type { AppState, Todo } from './types'

const KEY = 'todo-app-state'

export const defaultState: AppState = {
  todos: [],
  filter: { status: 'all' },
  search: '',
  sort: 'created',
  theme: 'light',
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.todos)) return defaultState
    const todos = parsed.todos.map((t: Todo) => ({ ...t, status: t.status ?? (t.done ? 'done' : 'todo') }))
    return { ...defaultState, ...parsed, todos }
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore quota / serialization errors
  }
}
