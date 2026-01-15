import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { taskAPI } from '../services/api';

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const { updateTask, deleteTask } = useContext(TaskContext);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const response = await taskAPI.getTask(taskId);
      setTask(response.data.task);
    } catch (error) {
      Alert.alert('Error', 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const result = await updateTask(taskId, { status: newStatus });
    if (result.success) {
      setTask((prev) => ({ ...prev, status: newStatus }));
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteTask(taskId);
            if (result.success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.centerContainer}>
        <Text>Task not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.subject}>{task.subject}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.text}>{task.description || 'No description'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Deadline</Text>
        <Text style={styles.text}>
          {new Date(task.deadline).toLocaleString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Priority</Text>
        <Text style={[styles.text, styles.priority]}>
          {task.priority.toUpperCase()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusButtons}>
          {['todo', 'in-progress', 'done'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                task.status === status && styles.statusButtonActive,
              ]}
              onPress={() => handleStatusChange(status)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  task.status === status && styles.statusButtonTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {task.is_recurring && (
        <View style={styles.section}>
          <Text style={styles.label}>Recurring</Text>
          <Text style={styles.text}>
            {task.recurrence_type} recurrence
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subject: {
    fontSize: 16,
    color: '#666',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  priority: {
    fontWeight: 'bold',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    marginBottom: 10,
  },
  statusButtonActive: {
    backgroundColor: '#007AFF',
  },
  statusButtonText: {
    color: '#333',
  },
  statusButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
