const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const timetableRoutes = require('./routes/timetable');
const errorHandler = require('./middleware/errorHandler');
const runMigrations = require('./utils/runMigrations');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Student Productivity API',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timetable', timetableRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    console.log('Running database migrations...');
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
