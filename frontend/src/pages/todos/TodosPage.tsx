import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { todoApi } from '../../store/api/todoApi';
import { Calendar, Settings, List, Grid, LogOut, LayoutGrid, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { TodoChart } from '../../components/todos/TodoChart';
import { TodoForm } from '../../components/todos/TodoForm';
import toast from 'react-hot-toast';

type ViewType = 'list' | 'grid' | 'calendar';

interface CreateTodoData {
  title: string;
  description?: string;
  dueDate?: string;
  categoryId?: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
}

const TodosPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: todos = [], isLoading, error } = todoApi.useGetTodosQuery();
  const { data: todoStats = [] } = todoApi.useGetTodoStatsQuery();
  const [view, setView] = useState<ViewType>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [createTodo] = todoApi.useCreateTodoMutation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const handleCreateTodo = async (data: CreateTodoData) => {
    try {
      const todoData = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        categoryId: data.categoryId || undefined,
        repeat: data.repeat || 'none'
      };

      await createTodo(todoData).unwrap();
      toast.success('Task created successfully');
      setIsAddingTodo(false);
    } catch (error: any) {
      console.error('Create Todo Error:', error);
      toast.error(error.data?.error || 'Failed to create task');
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading todos</div>;
  }

  const renderCalendarView = () => {
    const days = getDaysInMonth();
    const startDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-400">Monthly Task Progress</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-white"
            >
              &lt; Prev
            </button>
            <div className="text-sm text-gray-400">
              {format(currentDate, 'MMMM yyyy')}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-white"
            >
              Next &gt;
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-gray-400 font-medium">
              {day}
            </div>
          ))}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="p-2"></div>
          ))}
          {days.map(day => (
            <div
              key={day.toString()}
              className="p-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="text-gray-400 text-sm">{format(day, 'd')}</div>
              <div className="mt-1">
                {todos.filter(todo => 
                  format(new Date(todo.dueDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                ).map(todo => (
                  <div key={todo.id} className="text-xs text-gray-300 truncate">
                    {todo.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <TodoChart data={todoStats} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Completed Tasks</div>
              <div className="text-2xl font-bold text-indigo-500">
                {todoStats.reduce((sum, stat) => sum + stat.completed, 0)}
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-400">
                {todoStats.reduce((sum, stat) => sum + stat.total, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <div className="flex-1 space-y-4">
          <button 
            onClick={() => setView('list')}
            className={`p-3 rounded-lg ${view === 'list' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
          >
            <List className="text-white" size={20} />
          </button>
          <button 
            onClick={() => setView('grid')}
            className={`p-3 rounded-lg ${view === 'grid' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
          >
            <LayoutGrid className="text-white" size={20} />
          </button>
          <button 
            onClick={() => setView('calendar')}
            className={`p-3 rounded-lg ${view === 'calendar' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
          >
            <Calendar className="text-white" size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/categories')}
            className="p-3 rounded-lg hover:bg-gray-700"
          >
            <Grid className="text-white" size={20} />
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="p-3 rounded-lg hover:bg-gray-700"
          >
            <Settings className="text-white" size={20} />
          </button>
          <button 
            onClick={handleLogout}
            className="p-3 rounded-lg hover:bg-gray-700"
          >
            <LogOut className="text-white" size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16 p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">My Tasks</h1>
            <p className="text-gray-400">Welcome back, {user?.username}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAddingTodo(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-white"
            >
              <Plus size={20} className="mr-2" />
              Add Task
            </button>
            {view === 'calendar' && (
              <div className="text-white text-lg font-medium">
                {format(currentDate, 'MMMM yyyy')}
              </div>
            )}
          </div>
        </header>

        <main>
          {view === 'calendar' ? (
            renderCalendarView()
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todos.map(todo => (
                <div 
                  key={todo.id}
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <h3 className="text-lg font-medium text-white">{todo.title}</h3>
                  {todo.dueDate && (
                    <p className="text-sm text-gray-400 mt-2">
                      Due: {format(new Date(todo.dueDate), 'PP')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {todos.map(todo => (
                <li 
                  key={todo.id}
                  className="p-4 bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-750 transition-colors"
                >
                  <span className="text-gray-200">{todo.title}</span>
                  {todo.dueDate && (
                    <span className="text-sm text-gray-400">
                      {format(new Date(todo.dueDate), 'PP')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

      {/* Add the form modal */}
      {isAddingTodo && (
        <TodoForm
          onSubmit={handleCreateTodo}
          onClose={() => setIsAddingTodo(false)}
        />
      )}
    </div>
  );
};

export default TodosPage;