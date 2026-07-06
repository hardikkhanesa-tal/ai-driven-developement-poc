import type { Todo, Filter } from './types'

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  return todos.filter((todo) => {
    if (filter.status === 'active' && todo.done) return false
    if (filter.status === 'done' && !todo.done) return false
    if (filter.priority && todo.priority !== filter.priority) return false
    if (filter.tag && !todo.tags.includes(filter.tag)) return false
    return true
  })
}

export function searchTodos(todos: Todo[], query: string): Todo[] {
  const q = query.trim().toLowerCase()
  if (!q) return todos
  return todos.filter((todo) => todo.title.toLowerCase().includes(q))
}
