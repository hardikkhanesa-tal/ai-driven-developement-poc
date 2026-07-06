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
})
