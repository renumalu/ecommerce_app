import React, { createContext, useState, useCallback } from 'react';
import { timetableAPI } from '../services/api';

export const TimetableContext = createContext();

export const TimetableProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimetable = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await timetableAPI.getTimetable();
      setEntries(response.data.entries);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEntry = async (entryData) => {
    try {
      setError(null);
      const response = await timetableAPI.createEntry(entryData);
      setEntries((prev) => [...prev, response.data.entry]);
      return { success: true, entry: response.data.entry };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create entry';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateEntry = async (id, updates) => {
    try {
      setError(null);
      const response = await timetableAPI.updateEntry(id, updates);
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? response.data.entry : entry))
      );
      return { success: true, entry: response.data.entry };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update entry';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteEntry = async (id) => {
    try {
      setError(null);
      await timetableAPI.deleteEntry(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete entry';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <TimetableContext.Provider
      value={{
        entries,
        loading,
        error,
        fetchTimetable,
        createEntry,
        updateEntry,
        deleteEntry,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
