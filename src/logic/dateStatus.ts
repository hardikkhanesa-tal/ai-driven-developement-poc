export function dateStatus(
  dueDate: string | undefined,
  now: Date,
): 'overdue' | 'due-soon' | 'upcoming' | 'none' {
  if (!dueDate) return 'none'
  const due = new Date(dueDate)
  if (isNaN(due.getTime())) return 'none'
  const diffMs = due.getTime() - now.getTime()
  if (diffMs < 0) return 'overdue'
  if (diffMs <= 48 * 60 * 60 * 1000) return 'due-soon'
  return 'upcoming'
}
