import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    username: string;
  } | null;
  isAuthenticated: boolean;
}

// Helper function to initialize state from localStorage
const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const user = jwtDecode(token);
      return {
        token,
        user,
        isAuthenticated: true,
      };
    } catch (error) {
      localStorage.removeItem('token');
    }
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = initializeAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      state.token = token;
      try {
        state.user = jwtDecode(token);
        state.isAuthenticated = true;
        localStorage.setItem('token', token);
      } catch (error) {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;