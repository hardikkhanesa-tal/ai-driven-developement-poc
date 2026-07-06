import type { AppState } from './types'

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
    return { ...defaultState, ...parsed }
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
