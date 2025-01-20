import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { axiosInstance } from '../../api/axios';
import { Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axiosInstance.post('/auth/login', data);
      dispatch(setCredentials({ token: response.data.token }));
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Failed to login. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Email
        </label>
        <div className="mt-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            {...register('email')}
            type="email"
            className="pl-10 block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Password
        </label>
        <div className="mt-1 relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            {...register('password')}
            type="password"
            className="pl-10 block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          {...register('rememberMe')}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
        />
        <label className="ml-2 block text-sm text-gray-300">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign in
      </button>
    </form>
  );
};