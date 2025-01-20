const express = require('express');
const { getTodos, createTodo, updateTodo, deleteTodo, getTodoStats } = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.get('/stats', getTodoStats);

module.exports = router;
