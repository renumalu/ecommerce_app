# Student Productivity App - Backend

Node.js/Express backend API for the Student Productivity App.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database:
```bash
createdb student_productivity_db
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will automatically run migrations on startup.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks (supports filters: status, priority, startDate, endDate)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/overdue` - Get overdue tasks

### Timetable
- `GET /api/timetable` - Get all timetable entries
- `POST /api/timetable` - Create timetable entry
- `PUT /api/timetable/:id` - Update timetable entry
- `DELETE /api/timetable/:id` - Delete timetable entry
- `GET /api/timetable/subjects` - Get list of subjects

## Database Schema

- **users**: User accounts
- **tasks**: Task management with priority, status, recurring options
- **timetable_entries**: Weekly class schedule

## Authentication

Uses JWT tokens. Include in requests as:
```
Authorization: Bearer <token>
```
