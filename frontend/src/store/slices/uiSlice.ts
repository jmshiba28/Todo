import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  currentView: 'list' | 'grid' | 'calendar';
  loading: boolean;
  error: string | null;
}

const initialState: UiState = {
  sidebarOpen: true,
  currentView: 'list',
  loading: false,
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentView: (state, action: PayloadAction<UiState['currentView']>) => {
      state.currentView = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { toggleSidebar, setCurrentView, setLoading, setError } = uiSlice.actions;
export default uiSlice.reducer;