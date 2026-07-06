import { describe, it, expect } from 'vitest'
import { dateStatus } from './dateStatus'

const now = new Date('2026-07-06T12:00:00Z')

describe('dateStatus', () => {
  it('returns none when no due date', () => {
    expect(dateStatus(undefined, now)).toBe('none')
  })
  it('returns none for unparseable date', () => {
    expect(dateStatus('not-a-date', now)).toBe('none')
  })
  it('returns overdue when due in the past', () => {
    expect(dateStatus('2026-07-05T12:00:00Z', now)).toBe('overdue')
  })
  it('returns due-soon when within 48h', () => {
    expect(dateStatus('2026-07-07T12:00:00Z', now)).toBe('due-soon')
  })
  it('returns upcoming when beyond 48h', () => {
    expect(dateStatus('2026-07-10T12:00:00Z', now)).toBe('upcoming')
  })
  it('date-only string equal to local today is not overdue (parsed as local end-of-day)', () => {
    // Simulate a user in a non-UTC timezone: local 9am on Jul 6, 2026
    // new Date(2026, 6, 6, 9, 0, 0) is LOCAL time regardless of machine timezone
    const localNow = new Date(2026, 6, 6, 9, 0, 0)
    // A date-only string "2026-07-06" must NOT be treated as overdue at local 9am
    const result = dateStatus('2026-07-06', localNow)
    expect(result).not.toBe('overdue')
    // It should be due-soon or upcoming (local end-of-day is still in the future at 9am)
    expect(['due-soon', 'upcoming']).toContain(result)
  })
})
