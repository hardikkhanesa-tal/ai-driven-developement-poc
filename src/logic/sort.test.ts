import { describe, it, expect } from 'vitest'
import { sortTodos } from './sort'
import type { Todo } from './types'

const t = (over: Partial<Todo>): Todo => ({
  id: '1', title: 'x', done: false, priority: 'med', tags: [], createdAt: '2026-01-01T00:00:00Z', ...over,
})

describe('sortTodos', () => {
  it('by priority: high, med, low', () => {
    const todos = [t({ id: 'l', priority: 'low' }), t({ id: 'h', priority: 'high' }), t({ id: 'm', priority: 'med' })]
    expect(sortTodos(todos, 'priority').map(x => x.id)).toEqual(['h', 'm', 'l'])
  })
  it('by dueDate ascending, undefined last', () => {
    const todos = [
      t({ id: 'none' }),
      t({ id: 'late', dueDate: '2026-07-10T00:00:00Z' }),
      t({ id: 'early', dueDate: '2026-07-08T00:00:00Z' }),
    ]
    expect(sortTodos(todos, 'dueDate').map(x => x.id)).toEqual(['early', 'late', 'none'])
  })
  it('by created descending (newest first)', () => {
    const todos = [
      t({ id: 'old', createdAt: '2026-01-01T00:00:00Z' }),
      t({ id: 'new', createdAt: '2026-02-01T00:00:00Z' }),
    ]
    expect(sortTodos(todos, 'created').map(x => x.id)).toEqual(['new', 'old'])
  })
  it('does not mutate input', () => {
    const todos = [t({ id: 'a', priority: 'low' }), t({ id: 'b', priority: 'high' })]
    sortTodos(todos, 'priority')
    expect(todos.map(x => x.id)).toEqual(['a', 'b'])
  })
})
