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
} from 'react-native';
import { TimetableContext } from '../context/TimetableContext';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AddTimetableScreen({ navigation }) {
  const [subject, setSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const { createEntry } = useContext(TimetableContext);

  const handleSubmit = async () => {
    if (!subject || !startTime || !endTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const entryData = {
      subject,
      dayOfWeek,
      startTime,
      endTime,
      location,
    };

    setLoading(true);
    const result = await createEntry(entryData);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Class added successfully');
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

      <Text style={styles.label}>Day of Week</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.daySelector}>
          {DAYS.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                dayOfWeek === index && styles.dayButtonActive,
              ]}
              onPress={() => setDayOfWeek(index)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  dayOfWeek === index && styles.dayButtonTextActive,
                ]}
              >
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.label}>Start Time * (HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={startTime}
        onChangeText={setStartTime}
        placeholder="09:00"
      />

      <Text style={styles.label}>End Time * (HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={endTime}
        onChangeText={setEndTime}
        placeholder="10:30"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="e.g., Room 101"
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Add Class</Text>
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
    marginTop: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  daySelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dayButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  dayButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayButtonText: {
    color: '#333',
  },
  dayButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
