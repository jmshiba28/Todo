import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '../../types/todo';

interface TodosState {
  todos: Todo[];
  selectedTodo: Todo | null;
  filters: {
    search: string;
    priority: string[];
    category: string[];
    completed: boolean | null;
  };
}

const initialState: TodosState = {
  todos: [],
  selectedTodo: null,
  filters: {
    search: '',
    priority: [],
    category: [],
    completed: null,
  },
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    setSelectedTodo: (state, action: PayloadAction<Todo | null>) => {
      state.selectedTodo = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<TodosState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setTodos, setSelectedTodo, updateFilters, clearFilters } = todosSlice.actions;
export default todosSlice.reducer;