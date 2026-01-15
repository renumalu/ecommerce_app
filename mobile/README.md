# Student Productivity App - Mobile

React Native (Expo) mobile application for the Student Productivity App.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API URL:
Edit `src/config/api.js` to point to your backend server:
```javascript
export const API_URL = 'http://YOUR_BACKEND_URL:3000/api';
```

For local development:
- iOS simulator: `http://localhost:3000/api`
- Android emulator: `http://10.0.2.2:3000/api`
- Physical device: `http://YOUR_LOCAL_IP:3000/api`

3. Start the app:
```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Features

### Authentication
- User registration and login
- JWT token management
- Persistent authentication

### Task Management
- View all tasks with status indicators
- Create tasks with priority and recurring options
- Update task status (To-do, In-progress, Done)
- Edit and delete tasks
- Overdue task highlighting
- Filter tasks by status, priority, date range

### Class Timetable
- Weekly timetable view organized by day
- Add/edit/delete classes
- Display class times and locations
- Color-coded visual indicators

## Project Structure

```
src/
├── screens/         # All app screens
├── components/      # Reusable components
├── services/        # API service layer
├── context/         # State management (Context API)
├── navigation/      # Navigation configuration
├── config/          # App configuration
└── utils/           # Utility functions
```

## State Management

Uses React Context API for state management:
- **AuthContext**: User authentication state
- **TaskContext**: Task management
- **TimetableContext**: Timetable data

## Navigation

- **Bottom Tab Navigation**: Tasks, Timetable, More
- **Stack Navigation**: Nested navigation within each tab
