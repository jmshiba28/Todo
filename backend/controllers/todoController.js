const Todo = require('../models/Todo');
const Category = require('../models/Category');

exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id })
            .populate('category', 'name color')
            .sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        console.error('Get Todos Error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.createTodo = async (req, res) => {
    try {
        const { title, description, dueDate, categoryId, repeat } = req.body;
        
        // Create the todo object with only defined fields
        const todoData = {
            user: req.user.id,
            title: title.trim(),
            repeat: repeat || 'none'
        };

        // Add optional fields only if they exist and are valid
        if (description?.trim()) {
            todoData.description = description.trim();
        }
        
        if (dueDate) {
            todoData.dueDate = new Date(dueDate);
        }
        
        // Only add category if categoryId is provided and valid
        if (categoryId) {
            // Verify that the category exists and belongs to the user
            const category = await Category.findOne({
                _id: categoryId,
                userId: req.user.id
            });
            
            if (category) {
                todoData.category = categoryId;
            }
        }

        const newTodo = new Todo(todoData);
        const savedTodo = await newTodo.save();
        
        // Populate category if it exists
        const todo = await Todo.findById(savedTodo._id)
            .populate('category', 'name color');

        res.status(201).json(todo);
    } catch (err) {
        console.error('Create Todo Error:', err);
        res.status(500).json({ 
            error: 'Failed to create todo',
            details: err.message 
        });
    }
};

exports.updateTodo = async (req, res) => {
    const { title, category, repeat, completed } = req.body;
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        todo.title = title || todo.title;
        todo.category = category || todo.category;
        todo.repeat = repeat || todo.repeat;
        todo.completed = completed !== undefined ? completed : todo.completed;

        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await todo.remove();
        res.json({ message: 'Todo removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTodoStats = async (req, res) => {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const todos = await Todo.find({
            user: req.user.id,
            createdAt: { 
                $gte: firstDayOfMonth,
                $lte: lastDayOfMonth
            }
        });

        // Create an array for all days in the current month
        const daysInMonth = lastDayOfMonth.getDate();
        const stats = {};

        // Initialize all days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dateStr = date.toISOString().split('T')[0];
            stats[dateStr] = { completed: 0, total: 0 };
        }

        // Fill in the actual data
        todos.forEach(todo => {
            const date = todo.createdAt.toISOString().split('T')[0];
            if (stats[date]) {
                stats[date].total++;
                if (todo.completed) {
                    stats[date].completed++;
                }
            }
        });

        // Convert to array format
        const result = Object.entries(stats).map(([date, data]) => ({
            date,
            completed: data.completed,
            total: data.total
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
