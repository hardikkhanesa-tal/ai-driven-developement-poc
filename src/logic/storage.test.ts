import { describe, it, expect, beforeEach } from 'vitest'
import { loadState, saveState, defaultState } from './storage'

beforeEach(() => localStorage.clear())

describe('storage', () => {
  it('returns defaultState when empty', () => {
    expect(loadState()).toEqual(defaultState)
  })
  it('returns defaultState on corrupt data', () => {
    localStorage.setItem('todo-app-state', '{not json')
    expect(loadState()).toEqual(defaultState)
  })
  it('round-trips saved state', () => {
    const state = { ...defaultState, search: 'hi', todos: [] }
    saveState(state)
    expect(loadState()).toEqual(state)
  })
  it('backfills status on todos saved before kanban status existed', () => {
    const legacyTodo = { id: '1', title: 'x', done: true, priority: 'med', tags: [], createdAt: '2026-01-01T00:00:00Z' }
    localStorage.setItem('todo-app-state', JSON.stringify({ ...defaultState, todos: [legacyTodo] }))
    expect(loadState().todos[0].status).toBe('done')
  })
})
