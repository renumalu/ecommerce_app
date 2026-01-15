# Student Productivity App - Phase 1 MVP

A full-stack student productivity application with task management and class timetable features.

## Project Overview

This is Phase 1 of a student productivity app that helps students manage their tasks and class schedules. The application consists of:

- **Backend**: Node.js/Express REST API with PostgreSQL database
- **Mobile**: React Native (Expo) cross-platform mobile application

## Features

### Core Functionality
- ✅ User authentication (register/login with JWT)
- ✅ Task management with CRUD operations
- ✅ Task priority levels (high, medium, low)
- ✅ Task status tracking (to-do, in-progress, done)
- ✅ Recurring tasks (daily/weekly)
- ✅ Overdue task detection and highlighting
- ✅ Weekly class timetable
- ✅ Class schedule management
- ✅ Filter and sort tasks

## Tech Stack

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT authentication
- bcryptjs for password hashing
- express-validator for input validation

### Mobile
- React Native with Expo
- React Navigation (bottom tabs + stack)
- Context API for state management
- AsyncStorage for token persistence
- Axios for API communication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Expo CLI (for mobile development)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create PostgreSQL database:
```bash
createdb student_productivity_db
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Start the server (migrations run automatically):
```bash
npm run dev
```

The backend will run on http://localhost:3000

### Mobile Setup

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL in `src/config/api.js`:
```javascript
export const API_URL = 'http://YOUR_BACKEND_URL:3000/api';
```

4. Start the Expo development server:
```bash
npm start
```

5. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## API Documentation

See [backend/README.md](backend/README.md) for detailed API documentation.

### Main Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

**Tasks:**
- `GET /api/tasks` - Get all tasks (supports filters)
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/overdue` - Get overdue tasks

**Timetable:**
- `GET /api/timetable` - Get weekly schedule
- `POST /api/timetable` - Add class
- `PUT /api/timetable/:id` - Update class
- `DELETE /api/timetable/:id` - Delete class
- `GET /api/timetable/subjects` - Get subjects list

## Database Schema

### users
- id (serial primary key)
- email (unique)
- password_hash
- name
- created_at

### tasks
- id (serial primary key)
- user_id (foreign key)
- subject
- title
- description
- deadline
- priority (high/medium/low)
- status (todo/in-progress/done)
- is_recurring
- recurrence_type (daily/weekly)
- created_at
- updated_at

### timetable_entries
- id (serial primary key)
- user_id (foreign key)
- subject
- day_of_week (0-6)
- start_time
- end_time
- location
- created_at
- updated_at

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── index.js        # Server entry point
│   ├── migrations/         # SQL migrations
│   └── package.json
│
└── mobile/
    ├── src/
    │   ├── screens/        # App screens
    │   ├── components/     # Reusable components
    │   ├── context/        # State management
    │   ├── navigation/     # Navigation setup
    │   ├── services/       # API integration
    │   └── config/         # App configuration
    ├── App.js
    └── package.json
```

## Development Notes

- Database migrations run automatically on server start
- JWT tokens expire after 7 days by default
- All API routes except auth require Bearer token authentication
- Mobile app uses Context API for simple state management
- Overdue tasks are detected server-side based on current timestamp

## Future Phases

Phase 1 is complete. Future phases may include:
- Calendar integration
- Study session tracking
- AI-powered study recommendations
- Push notifications
- Grade tracking
- Study groups/collaboration

## License

This project is part of a student productivity application development.
