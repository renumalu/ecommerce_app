import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { TimetableContext } from '../context/TimetableContext';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetableScreen({ navigation }) {
  const { entries, loading, fetchTimetable } = useContext(TimetableContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTimetable();
    setRefreshing(false);
  };

  const groupByDay = () => {
    const grouped = {};
    DAYS.forEach((_, index) => {
      grouped[index] = [];
    });

    entries.forEach((entry) => {
      grouped[entry.day_of_week].push(entry);
    });

    return grouped;
  };

  const renderEntry = (entry) => (
    <TouchableOpacity
      key={entry.id}
      style={styles.entryCard}
      onPress={() => navigation.navigate('EditTimetable', { entryId: entry.id })}
    >
      <Text style={styles.entrySubject}>{entry.subject}</Text>
      <Text style={styles.entryTime}>
        {entry.start_time.substring(0, 5)} - {entry.end_time.substring(0, 5)}
      </Text>
      {entry.location && (
        <Text style={styles.entryLocation}>📍 {entry.location}</Text>
      )}
    </TouchableOpacity>
  );

  if (loading && entries.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const groupedEntries = groupByDay();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {DAYS.map((day, index) => (
          <View key={index} style={styles.daySection}>
            <Text style={styles.dayHeader}>{day}</Text>
            {groupedEntries[index].length > 0 ? (
              groupedEntries[index].map(renderEntry)
            ) : (
              <Text style={styles.noClasses}>No classes</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTimetable')}
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
  scrollView: {
    flex: 1,
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#007AFF',
    color: '#fff',
    padding: 12,
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  entrySubject: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  entryTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  entryLocation: {
    fontSize: 14,
    color: '#888',
  },
  noClasses: {
    textAlign: 'center',
    color: '#888',
    padding: 20,
    fontStyle: 'italic',
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
