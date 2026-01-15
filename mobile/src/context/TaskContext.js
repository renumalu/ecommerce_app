import React, { createContext, useState, useCallback } from 'react';
import { taskAPI } from '../services/api';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.getTasks(filters);
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    try {
      setError(null);
      const response = await taskAPI.createTask(taskData);
      setTasks((prev) => [...prev, response.data.task]);
      return { success: true, task: response.data.task };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateTask = async (id, updates) => {
    try {
      setError(null);
      const response = await taskAPI.updateTask(id, updates);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? response.data.task : task))
      );
      return { success: true, task: response.data.task };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteTask = async (id) => {
    try {
      setError(null);
      await taskAPI.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getOverdueTasks = async () => {
    try {
      setError(null);
      const response = await taskAPI.getOverdueTasks();
      return response.data.tasks;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch overdue tasks');
      return [];
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        getOverdueTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
