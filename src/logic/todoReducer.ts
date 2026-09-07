import type { AppState, Action, Todo } from './types'
import { defaultState } from './storage'

export const initialState: AppState = { ...defaultState }

export function todoReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'add': {
      const title = action.title.trim()
      if (!title) return state
      const todo: Todo = {
        id: action.id, title, done: false, status: 'todo', priority: action.priority,
        dueDate: action.dueDate, tags: action.tags, createdAt: action.createdAt,
      }
      return { ...state, todos: [...state.todos, todo] }
    }
    case 'toggle':
      return {
        ...state,
        todos: state.todos.map(t => t.id === action.id
          ? { ...t, done: !t.done, status: !t.done ? 'done' : 'todo' }
          : t),
      }
    case 'setStatus':
      return {
        ...state,
        todos: state.todos.map(t => t.id === action.id
          ? { ...t, status: action.status, done: action.status === 'done' }
          : t),
      }
    case 'edit':
      return { ...state, todos: state.todos.map(t => t.id === action.id ? { ...t, ...action.changes } : t) }
    case 'delete':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) }
    case 'setFilter':
      return { ...state, filter: action.filter }
    case 'setSearch':
      return { ...state, search: action.search }
    case 'setSort':
      return { ...state, sort: action.sort }
    case 'setTheme':
      return { ...state, theme: action.theme }
  }
}
