import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar } from 'lucide-react';
import { useGetCategoriesQuery } from '../../store/api/todoApi';
import { format } from 'date-fns';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  categoryId: z.string().optional(),
  repeat: z.enum(['none', 'daily', 'weekly', 'monthly']).default('none'),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => Promise<void>;
  onClose: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, onClose }) => {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      repeat: 'none',
    }
  });

  const onSubmitHandler = async (data: TodoFormData) => {
    try {
      // Clean up the data before sending
      const todoData = {
        title: data.title.trim(),
        description: data.description?.trim(),
        repeat: data.repeat,
        ...(data.dueDate ? { dueDate: data.dueDate } : {}),
        ...(data.categoryId ? { categoryId: data.categoryId } : {})
      };

      await onSubmit(todoData);
    } catch (error) {
      console.error('Submit Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">New Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Title
            </label>
            <input
              {...register('title')}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white h-24"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                {...register('dueDate')}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                min={format(new Date(), 'yyyy-MM-dd')}
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Category
            </label>
            <select
              {...register('categoryId')}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              defaultValue=""
            >
              <option value="">No Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Repeat
            </label>
            <select
              {...register('repeat')}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="none">Don't repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}; 