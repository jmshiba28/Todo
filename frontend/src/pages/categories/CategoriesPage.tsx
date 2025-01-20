import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { todoApi } from '../../store/api/todoApi';
import toast from 'react-hot-toast';

interface CategoryFormData {
  name: string;
  color: string;
}

const defaultColors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6366F1', // indigo
  '#14B8A6', // teal
];

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    color: defaultColors[0]
  });

  const { data: categories = [] } = todoApi.useGetCategoriesQuery();
  const [createCategory] = todoApi.useCreateCategoryMutation();
  const [updateCategory] = todoApi.useUpdateCategoryMutation();
  const [deleteCategory] = todoApi.useDeleteCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          ...formData
        }).unwrap();
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData).unwrap();
        toast.success('Category created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id).unwrap();
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      color: defaultColors[0]
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold">Categories</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category: any) => (
            <div
              key={category.id}
              className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Color
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {defaultColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full ${
                          formData.color === color ? 'ring-2 ring-white' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;