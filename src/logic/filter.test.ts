import { describe, it, expect } from 'vitest'
import { filterTodos, searchTodos } from './filter'
import type { Todo } from './types'

const t = (over: Partial<Todo>): Todo => ({
  id: '1', title: 'x', done: false, status: 'todo', priority: 'med', tags: [], createdAt: '2026-01-01T00:00:00Z', ...over,
})

describe('filterTodos', () => {
  const todos = [
    t({ id: 'a', done: false, priority: 'high', tags: ['work'] }),
    t({ id: 'b', done: true, priority: 'low', tags: ['home'] }),
  ]
  it('all returns everything', () => {
    expect(filterTodos(todos, { status: 'all' })).toHaveLength(2)
  })
  it('active returns not-done', () => {
    expect(filterTodos(todos, { status: 'active' }).map(x => x.id)).toEqual(['a'])
  })
  it('done returns done', () => {
    expect(filterTodos(todos, { status: 'done' }).map(x => x.id)).toEqual(['b'])
  })
  it('filters by priority', () => {
    expect(filterTodos(todos, { status: 'all', priority: 'high' }).map(x => x.id)).toEqual(['a'])
  })
  it('filters by tag', () => {
    expect(filterTodos(todos, { status: 'all', tag: 'home' }).map(x => x.id)).toEqual(['b'])
  })
})

describe('searchTodos', () => {
  const todos = [t({ id: 'a', title: 'Buy Milk' }), t({ id: 'b', title: 'Call Bob' })]
  it('empty query returns all', () => {
    expect(searchTodos(todos, '')).toHaveLength(2)
  })
  it('matches case-insensitively', () => {
    expect(searchTodos(todos, 'milk').map(x => x.id)).toEqual(['a'])
  })
})
