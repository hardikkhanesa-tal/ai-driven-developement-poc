export function dateStatus(
  dueDate: string | undefined,
  now: Date,
): 'overdue' | 'due-soon' | 'upcoming' | 'none' {
  if (!dueDate) return 'none'
  let due: Date
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    // Parse date-only strings as LOCAL end-of-day so a "today" due date is
    // never overdue until midnight passes in the user's local timezone.
    const [y, m, d] = dueDate.split('-').map(Number)
    due = new Date(y, m - 1, d, 23, 59, 59, 999)
  } else {
    due = new Date(dueDate)
  }
  if (isNaN(due.getTime())) return 'none'
  const diffMs = due.getTime() - now.getTime()
  if (diffMs < 0) return 'overdue'
  if (diffMs <= 48 * 60 * 60 * 1000) return 'due-soon'
  return 'upcoming'
}
