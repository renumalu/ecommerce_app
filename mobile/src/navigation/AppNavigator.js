import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TaskListScreen from '../screens/TaskListScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TimetableScreen from '../screens/TimetableScreen';
import AddTimetableScreen from '../screens/AddTimetableScreen';
import EditTimetableScreen from '../screens/EditTimetableScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TaskStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TaskList" 
        component={TaskListScreen} 
        options={{ title: 'Tasks' }}
      />
      <Stack.Screen 
        name="CreateTask" 
        component={CreateTaskScreen} 
        options={{ title: 'Create Task' }}
      />
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen} 
        options={{ title: 'Task Details' }}
      />
    </Stack.Navigator>
  );
}

function TimetableStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TimetableView" 
        component={TimetableScreen} 
        options={{ title: 'Timetable' }}
      />
      <Stack.Screen 
        name="AddTimetable" 
        component={AddTimetableScreen} 
        options={{ title: 'Add Class' }}
      />
      <Stack.Screen 
        name="EditTimetable" 
        component={EditTimetableScreen} 
        options={{ title: 'Edit Class' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileView" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tab.Screen 
        name="Tasks" 
        component={TaskStack}
        options={{
          tabBarLabel: 'Tasks',
        }}
      />
      <Tab.Screen 
        name="Timetable" 
        component={TimetableStack}
        options={{
          tabBarLabel: 'Timetable',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          tabBarLabel: 'More',
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
