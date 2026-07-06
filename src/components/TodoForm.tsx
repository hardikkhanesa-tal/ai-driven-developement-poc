import { useState, FormEvent } from 'react'
import type { Priority } from '../logic/types'

export interface TodoInput {
  title: string
  priority: Priority
  dueDate?: string
  tags: string[]
}

export function TodoForm({ onAdd }: { onAdd: (input: TodoInput) => void }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('med')
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      priority,
      dueDate: dueDate || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setTitle(''); setDueDate(''); setTags(''); setPriority('med')
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-lg">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs doing?"
        className="flex-1 min-w-[12rem] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent" />
      <select value={priority} onChange={e => setPriority(e.target.value as Priority)}
        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent">
        <option value="high">High</option>
        <option value="med">Med</option>
        <option value="low">Low</option>
      </select>
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent" />
      <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tags, comma, sep"
        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent" />
      <button type="submit"
        className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:opacity-90 transition">
        Add
      </button>
    </form>
  )
}
