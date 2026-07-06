import { useReducer, useEffect, useMemo } from 'react'
import { todoReducer, initialState } from '../logic/todoReducer'
import { loadState, saveState } from '../logic/storage'
import { filterTodos, searchTodos } from '../logic/filter'
import { sortTodos } from '../logic/sort'

export function useTodos() {
  const [state, dispatch] = useReducer(todoReducer, initialState, loadState)

  useEffect(() => { saveState(state) }, [state])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark')
  }, [state.theme])

  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(state.todos, state.filter)
    const searched = searchTodos(filtered, state.search)
    return sortTodos(searched, state.sort)
  }, [state.todos, state.filter, state.search, state.sort])

  const allTags = useMemo(
    () => Array.from(new Set(state.todos.flatMap(t => t.tags))).sort(),
    [state.todos],
  )

  return { state, dispatch, visibleTodos, allTags }
}
