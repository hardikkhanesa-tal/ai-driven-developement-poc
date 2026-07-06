import { useTodos } from './hooks/useTodos'
import { TodoForm, TodoInput } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { SearchBox } from './components/SearchBox'
import { FilterBar } from './components/FilterBar'
import { ThemeToggle } from './components/ThemeToggle'
import { dateStatus } from './logic/dateStatus'

export default function App() {
  const { state, dispatch, visibleTodos, allTags } = useTodos()
  const now = new Date()

  const overdue = state.todos.filter(t => !t.done && dateStatus(t.dueDate, now) === 'overdue').length
  const dueSoon = state.todos.filter(t => !t.done && dateStatus(t.dueDate, now) === 'due-soon').length

  function handleAdd(input: TodoInput) {
    dispatch({
      type: 'add', id: crypto.randomUUID(), createdAt: new Date().toISOString(),
      title: input.title, priority: input.priority, dueDate: input.dueDate, tags: input.tags,
    })
  }

  const emptyMessage = state.todos.length === 0
    ? 'No todos yet — add your first one! 🎉'
    : 'No todos match your filters.'

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100">
      <div className="max-w-2xl mx-auto p-6 flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
            ✨ My Todos
          </h1>
          <ThemeToggle theme={state.theme} onToggle={() => dispatch({ type: 'setTheme', theme: state.theme === 'dark' ? 'light' : 'dark' })} />
        </header>

        {(overdue > 0 || dueSoon > 0) && (
          <div className="flex gap-2 text-sm">
            {overdue > 0 && <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700">{overdue} overdue</span>}
            {dueSoon > 0 && <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700">{dueSoon} due soon</span>}
          </div>
        )}

        <TodoForm onAdd={handleAdd} />
        <SearchBox value={state.search} onChange={v => dispatch({ type: 'setSearch', search: v })} />
        <FilterBar filter={state.filter} sort={state.sort} tags={allTags}
          onFilter={f => dispatch({ type: 'setFilter', filter: f })}
          onSort={s => dispatch({ type: 'setSort', sort: s })} />
        <TodoList todos={visibleTodos} now={now} emptyMessage={emptyMessage}
          onToggle={id => dispatch({ type: 'toggle', id })}
          onDelete={id => dispatch({ type: 'delete', id })}
          onEdit={(id, changes) => dispatch({ type: 'edit', id, changes })} />
      </div>
    </div>
  )
}
