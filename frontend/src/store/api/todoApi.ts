import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Todo, Category } from '../../types/todo';
import { RootState } from '../store';

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    dueDateReminder: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
  };
}

export interface TodoStats {
  date: string;
  completed: number;
  total: number;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  categoryId?: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  dueDate?: string;
  categoryId?: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
}

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl:  'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Todo', 'Category', 'Settings'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => 'todos',
      providesTags: ['Todo'],
    }),
    getTodoById: builder.query<Todo, string>({
      query: (id) => `todos/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Todo', id }],
    }),
    createTodo: builder.mutation<Todo, CreateTodoInput>({
      query: (todo) => ({
        url: 'todos',
        method: 'POST',
        body: todo,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodo: builder.mutation<Todo, Partial<Todo> & { id: string }>({
      query: ({ id, ...todo }) => ({
        url: `todos/${id}`,
        method: 'PATCH',
        body: todo,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Todo', id }],
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todo'],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => 'categories',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (category) => ({
        url: 'categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<Category, Partial<Category> & { id: string }>({
      query: ({ id, ...category }) => ({
        url: `categories/${id}`,
        method: 'PATCH',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    getSettings: builder.query<UserSettings, void>({
      query: () => 'settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<UserSettings, Partial<UserSettings>>({
      query: (settings) => ({
        url: 'settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Settings'],
    }),
    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (passwords) => ({
        url: 'settings/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: 'settings/delete-account',
        method: 'DELETE',
      }),
    }),
    getTodoStats: builder.query<TodoStats[], void>({
      query: () => 'todos/stats',
      providesTags: ['Todo'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetTodoStatsQuery,
} = todoApi;