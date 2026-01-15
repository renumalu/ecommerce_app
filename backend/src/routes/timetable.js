const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const {
  getTimetable,
  createEntry,
  updateEntry,
  deleteEntry,
  getSubjects,
} = require('../controllers/timetableController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTimetable);

router.get('/subjects', getSubjects);

router.post(
  '/',
  [
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('dayOfWeek')
      .isInt({ min: 0, max: 6 })
      .withMessage('Day of week must be between 0 and 6'),
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time required (HH:MM)'),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time required (HH:MM)'),
    body('location').optional().trim(),
  ],
  createEntry
);

router.put(
  '/:id',
  [
    body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
    body('dayOfWeek')
      .optional()
      .isInt({ min: 0, max: 6 })
      .withMessage('Day of week must be between 0 and 6'),
    body('startTime')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Valid start time required (HH:MM)'),
    body('endTime')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Valid end time required (HH:MM)'),
    body('location').optional().trim(),
  ],
  updateEntry
);

router.delete('/:id', deleteEntry);

module.exports = router;
