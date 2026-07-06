import type { Todo, SortKey } from './types'

const PRIORITY_RANK: Record<Todo['priority'], number> = { high: 0, med: 1, low: 2 }

export function sortTodos(todos: Todo[], sort: SortKey): Todo[] {
  const copy = [...todos]
  switch (sort) {
    case 'priority':
      return copy.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
    case 'dueDate':
      return copy.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      })
    case 'created':
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}
