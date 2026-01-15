const { validationResult } = require('express-validator');
const Task = require('../models/Task');

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, startDate, endDate } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const tasks = await Task.findByUserId(req.userId, filters);
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      subject,
      title,
      description,
      deadline,
      priority,
      status,
      isRecurring,
      recurrenceType,
    } = req.body;

    const task = await Task.create({
      userId: req.userId,
      subject,
      title,
      description,
      deadline,
      priority,
      status,
      isRecurring,
      recurrenceType,
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id, req.userId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    const task = await Task.update(id, req.userId, updates);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.delete(id, req.userId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', task });
  } catch (error) {
    next(error);
  }
};

const getOverdueTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findOverdue(req.userId);
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getOverdueTasks,
};
