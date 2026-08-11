import { describe, it, expect } from 'vitest'
import { todoReducer, initialState } from './todoReducer'
import type { AppState } from './types'

const addAction = {
  type: 'add' as const, id: '1', title: 'Task', priority: 'high' as const,
  tags: ['work'], dueDate: '2026-07-10', createdAt: '2026-07-06T00:00:00Z',
}

describe('todoReducer', () => {
  it('add appends a todo', () => {
    const s = todoReducer(initialState, addAction)
    expect(s.todos).toHaveLength(1)
    expect(s.todos[0]).toMatchObject({ id: '1', title: 'Task', priority: 'high', done: false, status: 'todo', tags: ['work'] })
  })
  it('toggle flips done and mirrors status', () => {
    const s1 = todoReducer(initialState, addAction)
    const s2 = todoReducer(s1, { type: 'toggle', id: '1' })
    expect(s2.todos[0].done).toBe(true)
    expect(s2.todos[0].status).toBe('done')
    const s3 = todoReducer(s2, { type: 'toggle', id: '1' })
    expect(s3.todos[0].done).toBe(false)
    expect(s3.todos[0].status).toBe('todo')
  })
  it('setStatus updates status and mirrors done', () => {
    const s1 = todoReducer(initialState, addAction)
    const s2 = todoReducer(s1, { type: 'setStatus', id: '1', status: 'in-progress' })
    expect(s2.todos[0].status).toBe('in-progress')
    expect(s2.todos[0].done).toBe(false)
    const s3 = todoReducer(s2, { type: 'setStatus', id: '1', status: 'done' })
    expect(s3.todos[0].status).toBe('done')
    expect(s3.todos[0].done).toBe(true)
  })
  it('edit applies changes and preserves untouched fields', () => {
    const s1 = todoReducer(initialState, addAction)
    const s2 = todoReducer(s1, { type: 'edit', id: '1', changes: { title: 'New', priority: 'low' } })
    // Changed fields
    expect(s2.todos[0]).toMatchObject({ title: 'New', priority: 'low' })
    // Untouched fields must survive the merge
    expect(s2.todos[0].id).toBe('1')
    expect(s2.todos[0].done).toBe(false)
    expect(s2.todos[0].tags).toEqual(['work'])
    expect(s2.todos[0].dueDate).toBe('2026-07-10')
  })
  it('delete removes todo', () => {
    const s1 = todoReducer(initialState, addAction)
    const s2 = todoReducer(s1, { type: 'delete', id: '1' })
    expect(s2.todos).toHaveLength(0)
  })
  it('add trims title and ignores blank', () => {
    const s = todoReducer(initialState, { ...addAction, title: '   ' })
    expect(s.todos).toHaveLength(0)
  })
  it('setFilter/setSearch/setSort/setTheme update fields', () => {
    let s: AppState = initialState
    s = todoReducer(s, { type: 'setSearch', search: 'x' })
    s = todoReducer(s, { type: 'setSort', sort: 'priority' })
    s = todoReducer(s, { type: 'setTheme', theme: 'dark' })
    s = todoReducer(s, { type: 'setFilter', filter: { status: 'active' } })
    expect(s).toMatchObject({ search: 'x', sort: 'priority', theme: 'dark', filter: { status: 'active' } })
  })
})
