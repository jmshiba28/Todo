// Placeholder for handling repeatable tasks logic
module.exports = () => {
    const Todo = require('../models/Todo');
    const cron = require('node-cron');

    // Check for todos that need to be repeated daily
    cron.schedule('0 0 * * *', async () => {
        try {
            const todos = await Todo.find({ repeat: 'daily', completed: true });
            for (const todo of todos) {
                // Create new todo for next day
                const newTodo = new Todo({
                    user: todo.user,
                    title: todo.title,
                    category: todo.category,
                    repeat: todo.repeat,
                    completed: false
                });
                await newTodo.save();
                
                // Mark original as non-repeating
                todo.repeat = null;
                await todo.save();
            }
        } catch (err) {
            console.error('Error handling daily todos:', err);
        }
    });

    // Check for todos that need to be repeated weekly
    cron.schedule('0 0 * * 0', async () => {
        try {
            const todos = await Todo.find({ repeat: 'weekly', completed: true });
            for (const todo of todos) {
                // Create new todo for next week
                const newTodo = new Todo({
                    user: todo.user,
                    title: todo.title, 
                    category: todo.category,
                    repeat: todo.repeat,
                    completed: false
                });
                await newTodo.save();

                // Mark original as non-repeating
                todo.repeat = null;
                await todo.save();
            }
        } catch (err) {
            console.error('Error handling weekly todos:', err);
        }
    });

    // Check for todos that need to be repeated monthly
    cron.schedule('0 0 1 * *', async () => {
        try {
            const todos = await Todo.find({ repeat: 'monthly', completed: true });
            for (const todo of todos) {
                // Create new todo for next month
                const newTodo = new Todo({
                    user: todo.user,
                    title: todo.title,
                    category: todo.category, 
                    repeat: todo.repeat,
                    completed: false
                });
                await newTodo.save();

                // Mark original as non-repeating
                todo.repeat = null;
                await todo.save();
            }
        } catch (err) {
            console.error('Error handling monthly todos:', err);
        }
    });
};
