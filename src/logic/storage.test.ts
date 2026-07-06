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
})
