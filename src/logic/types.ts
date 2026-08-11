export type Priority = 'high' | 'med' | 'low';

export type SortKey = 'priority' | 'dueDate' | 'created';

export type StatusFilter = 'all' | 'active' | 'done';

export type KanbanStatus = 'todo' | 'in-progress' | 'done';

export interface Filter {
  status: StatusFilter;
  priority?: Priority;
  tag?: string;
}

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  status: KanbanStatus;
  priority: Priority;
  dueDate?: string;
  tags: string[];
  createdAt: string;
}

export interface AppState {
  todos: Todo[];
  filter: Filter;
  search: string;
  sort: SortKey;
  theme: 'light' | 'dark';
}

export type Action =
  | { type: 'add'; title: string; priority: Priority; dueDate?: string; tags: string[]; id: string; createdAt: string }
  | { type: 'toggle'; id: string }
  | { type: 'setStatus'; id: string; status: KanbanStatus }
  | { type: 'edit'; id: string; changes: Partial<Pick<Todo, 'title' | 'priority' | 'dueDate' | 'tags'>> }
  | { type: 'delete'; id: string }
  | { type: 'setFilter'; filter: Filter }
  | { type: 'setSearch'; search: string }
  | { type: 'setSort'; sort: SortKey }
  | { type: 'setTheme'; theme: 'light' | 'dark' };
