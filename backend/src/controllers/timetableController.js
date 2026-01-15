const { validationResult } = require('express-validator');
const Timetable = require('../models/Timetable');

const getTimetable = async (req, res, next) => {
  try {
    const entries = await Timetable.findByUserId(req.userId);
    res.json({ entries });
  } catch (error) {
    next(error);
  }
};

const createEntry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, dayOfWeek, startTime, endTime, location } = req.body;

    const entry = await Timetable.create({
      userId: req.userId,
      subject,
      dayOfWeek,
      startTime,
      endTime,
      location,
    });

    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
};

const updateEntry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    const entry = await Timetable.update(id, req.userId, updates);

    if (!entry) {
      return res.status(404).json({ error: 'Timetable entry not found' });
    }

    res.json({ entry });
  } catch (error) {
    next(error);
  }
};

const deleteEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await Timetable.delete(id, req.userId);

    if (!entry) {
      return res.status(404).json({ error: 'Timetable entry not found' });
    }

    res.json({ message: 'Timetable entry deleted successfully', entry });
  } catch (error) {
    next(error);
  }
};

const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Timetable.getSubjects(req.userId);
    res.json({ subjects });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTimetable,
  createEntry,
  updateEntry,
  deleteEntry,
  getSubjects,
};
