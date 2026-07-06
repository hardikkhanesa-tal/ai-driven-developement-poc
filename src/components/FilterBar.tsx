import type { Filter, Priority, SortKey } from '../logic/types'

const STATUSES: Filter['status'][] = ['all', 'active', 'done']

export function FilterBar({ filter, sort, tags, onFilter, onSort }: {
  filter: Filter; sort: SortKey; tags: string[]
  onFilter: (f: Filter) => void; onSort: (s: SortKey) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex gap-1">
        {STATUSES.map(s => (
          <button key={s} onClick={() => onFilter({ ...filter, status: s })}
            className={`px-3 py-1 rounded-full text-sm capitalize transition ${filter.status === s ? 'bg-violet-500 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
            {s}
          </button>
        ))}
      </div>
      <select value={filter.priority ?? ''} onChange={e => onFilter({ ...filter, priority: (e.target.value || undefined) as Priority | undefined })}
        className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700">
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="med">Med</option>
        <option value="low">Low</option>
      </select>
      <select value={filter.tag ?? ''} onChange={e => onFilter({ ...filter, tag: e.target.value || undefined })}
        className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700">
        <option value="">All tags</option>
        {tags.map(t => <option key={t} value={t}>#{t}</option>)}
      </select>
      <select value={sort} onChange={e => onSort(e.target.value as SortKey)}
        className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 ml-auto">
        <option value="created">Newest</option>
        <option value="priority">Priority</option>
        <option value="dueDate">Due date</option>
      </select>
    </div>
  )
}
