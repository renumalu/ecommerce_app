import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { TaskContext } from '../context/TaskContext';

const priorityColors = {
  high: '#FF3B30',
  medium: '#FF9500',
  low: '#34C759',
};

const statusColors = {
  todo: '#007AFF',
  'in-progress': '#FF9500',
  done: '#34C759',
};

export default function TaskListScreen({ navigation }) {
  const { tasks, loading, fetchTasks, getOverdueTasks } = useContext(TaskContext);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    await fetchTasks();
    const overdue = await getOverdueTasks();
    setOverdueTasks(overdue);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const isOverdue = (taskId) => {
    return overdueTasks.some((t) => t.id === taskId);
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        isOverdue(item.id) && styles.overdueTask,
      ]}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: priorityColors[item.priority] },
          ]}
        >
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
      <Text style={styles.taskSubject}>{item.subject}</Text>
      <Text style={styles.taskDeadline}>
        Due: {new Date(item.deadline).toLocaleDateString()}
      </Text>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: statusColors[item.status] },
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      {isOverdue(item.id) && (
        <Text style={styles.overdueText}>OVERDUE</Text>
      )}
    </TouchableOpacity>
  );

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Create one!</Text>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTask')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
  listContent: {
    padding: 15,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  overdueTask: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  taskSubject: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  taskDeadline: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  overdueText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
