import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { TaskContext } from '../context/TaskContext';

export default function CreateTaskScreen({ navigation }) {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('weekly');
  const [loading, setLoading] = useState(false);

  const { createTask } = useContext(TaskContext);

  const handleSubmit = async () => {
    if (!subject || !title || !deadline) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const taskData = {
      subject,
      title,
      description,
      deadline: new Date(deadline).toISOString(),
      priority,
      isRecurring,
      recurrenceType: isRecurring ? recurrenceType : null,
    };

    setLoading(true);
    const result = await createTask(taskData);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Task created successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Subject *</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder="e.g., Mathematics"
      />

      <Text style={styles.label}>Title *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., Complete homework"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Additional details..."
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Deadline * (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={deadline}
        onChangeText={setDeadline}
        placeholder="2024-12-31"
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityContainer}>
        {['low', 'medium', 'high'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityButton,
              priority === p && styles.priorityButtonActive,
            ]}
            onPress={() => setPriority(p)}
          >
            <Text
              style={[
                styles.priorityButtonText,
                priority === p && styles.priorityButtonTextActive,
              ]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Recurring Task</Text>
        <Switch value={isRecurring} onValueChange={setIsRecurring} />
      </View>

      {isRecurring && (
        <>
          <Text style={styles.label}>Recurrence Type</Text>
          <View style={styles.priorityContainer}>
            {['daily', 'weekly'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.priorityButton,
                  recurrenceType === type && styles.priorityButtonActive,
                ]}
                onPress={() => setRecurrenceType(type)}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    recurrenceType === type && styles.priorityButtonTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Task</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityButtonText: {
    color: '#333',
    textTransform: 'capitalize',
  },
  priorityButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
