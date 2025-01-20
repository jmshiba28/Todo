import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../types/todo';

interface CategoriesState {
  categories: Category[];
  selectedCategory: Category | null;
}

const initialState: CategoriesState = {
  categories: [],
  selectedCategory: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
  },
});

export const {
  setCategories,
  setSelectedCategory,
  addCategory,
  removeCategory,
  updateCategory,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;