import type { Todo } from '../logic/types'
import { TodoItem } from './TodoItem'

export function TodoList({ todos, now, emptyMessage, onToggle, onDelete }: {
  todos: Todo[]; now: Date; emptyMessage: string
  onToggle: (id: string) => void; onDelete: (id: string) => void
}) {
  if (todos.length === 0) {
    return <p className="text-center text-slate-400 py-10">{emptyMessage}</p>
  }
  return (
    <ul className="flex flex-col gap-2">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} now={now} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
