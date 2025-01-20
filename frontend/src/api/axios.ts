import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const baseURL =  'http://localhost:5000/api';

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);