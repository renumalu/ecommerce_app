const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getOverdueTasks,
} = require('../controllers/taskController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);

router.get('/overdue', getOverdueTasks);

router.post(
  '/',
  [
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('deadline').isISO8601().withMessage('Valid deadline is required'),
    body('priority')
      .isIn(['high', 'medium', 'low'])
      .withMessage('Priority must be high, medium, or low'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Status must be todo, in-progress, or done'),
    body('isRecurring').optional().isBoolean().withMessage('isRecurring must be a boolean'),
    body('recurrenceType')
      .optional()
      .isIn(['daily', 'weekly', null])
      .withMessage('recurrenceType must be daily or weekly'),
  ],
  createTask
);

router.get('/:id', getTask);

router.put(
  '/:id',
  [
    body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('deadline').optional().isISO8601().withMessage('Valid deadline is required'),
    body('priority')
      .optional()
      .isIn(['high', 'medium', 'low'])
      .withMessage('Priority must be high, medium, or low'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Status must be todo, in-progress, or done'),
  ],
  updateTask
);

router.delete('/:id', deleteTask);

module.exports = router;
