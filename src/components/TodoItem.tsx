import { useState, useRef, useEffect } from 'react'
import type { Todo } from '../logic/types'
import { dateStatus } from '../logic/dateStatus'

const PRIORITY_BORDER: Record<Todo['priority'], string> = {
  high: 'border-l-rose-500', med: 'border-l-amber-400', low: 'border-l-emerald-400',
}
const STATUS_BADGE: Record<string, string> = {
  overdue: 'bg-rose-100 text-rose-700', 'due-soon': 'bg-amber-100 text-amber-700',
  upcoming: 'bg-sky-100 text-sky-700', none: 'hidden',
}

export function TodoItem({ todo, now, onToggle, onDelete, onEdit }: {
  todo: Todo; now: Date
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, changes: { title: string }) => void
}) {
  const status = dateStatus(todo.dueDate, now)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setEditValue(todo.title)
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing, todo.title])

  function commitEdit() {
    const trimmed = editValue.trim()
    if (trimmed) {
      onEdit(todo.id, { title: trimmed })
    }
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
    setEditValue(todo.title)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit()
    else if (e.key === 'Escape') cancelEdit()
  }

  return (
    <li className={`flex items-center gap-3 p-3 pl-4 rounded-xl border-l-4 ${PRIORITY_BORDER[todo.priority]} bg-white dark:bg-slate-800 shadow transition hover:shadow-md`}>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)}
        className="w-5 h-5 accent-violet-500 cursor-pointer" />
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="w-full rounded px-2 py-0.5 border border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:bg-slate-700 dark:text-slate-100 text-sm"
            aria-label="edit title"
          />
        ) : (
          <p
            className={`truncate ${todo.done ? 'line-through text-slate-400' : ''} cursor-pointer`}
            onDoubleClick={() => !todo.done && setEditing(true)}
            title="Double-click to edit"
          >
            {todo.title}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mt-1">
          {todo.dueDate && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[status]}`}>
              {todo.dueDate}
            </span>
          )}
          {todo.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">#{tag}</span>
          ))}
        </div>
      </div>
      {!editing && (
        <button
          onClick={() => !todo.done && setEditing(true)}
          aria-label="edit"
          disabled={todo.done}
          className="text-slate-400 hover:text-violet-500 transition text-base leading-none disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ✏️
        </button>
      )}
      <button onClick={() => onDelete(todo.id)} aria-label="delete"
        className="text-slate-400 hover:text-rose-500 transition text-xl leading-none">×</button>
    </li>
  )
}
