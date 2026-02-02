import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'measurements_storage';

// Simple storage wrapper
const storage = {
  getItem: async (key) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem(key);
    }
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(key, value);
    }
  }
};

// Separate form component
function MeasurementForm({ onSubmit, unit, setUnit }) {
  const [name, setName] = useState('');
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [height, setHeight] = useState('');

  const handleSubmit = () => {
    if (!name || !bust || !waist || !height) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit({ name, bust, waist, height, unit });
    
    // Clear form
    setName('');
    setBust('');
    setWaist('');
    setHeight('');
  };

  return (
    <>
      {/* Unit Toggle */}
      <View style={styles.unitToggle}>
        <TouchableOpacity
          style={[styles.unitButton, unit === 'in' && styles.unitButtonActive]}
          onPress={() => setUnit('in')}
        >
          <Text style={[styles.unitText, unit === 'in' && styles.unitTextActive]}>
            Imperial (in)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.unitButton, unit === 'cm' && styles.unitButtonActive]}
          onPress={() => setUnit('cm')}
        >
          <Text style={[styles.unitText, unit === 'cm' && styles.unitTextActive]}>
            Metric (cm)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <Text style={styles.label}>Bust</Text>
        <TextInput
          style={styles.input}
          placeholder="34.0"
          value={bust}
          onChangeText={(text) => setBust(text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Waist</Text>
        <TextInput
          style={styles.input}
          placeholder="28.0"
          value={waist}
          onChangeText={(text) => setWaist(text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Height</Text>
        <TextInput
          style={styles.input}
          placeholder="65.0"
          value={height}
          onChangeText={(text) => setHeight(text)}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>💾 Save Measurement</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default function BodyMeasurementsTracker() {
  const [unit, setUnit] = useState('in');
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    loadMeasurements();
    // const loadData = async () => {
    //   try {
    //     const stored = await storage.getItem('measurements');
    //     if (stored) {
    //       setMeasurements(JSON.parse(stored));
    //     }
    //   } catch (error) {
    //     console.error('Error loading:', error);
    //   }
    // };
    // loadData();
  }, []);

  const loadMeasurements = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMeasurements(parsed);
        }
      }
    } catch (e) {
      console.warn('Error loading photos', e);
    }
  };

  const handleFormSubmit = async (formData) => {
    const newMeasurement = {
      ...formData,
      date: new Date().toLocaleDateString(),
    };
    
    const updated = [newMeasurement, ...measurements];
    setMeasurements(updated);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('Error saving', e);
    }
    
    try {
      await storage.setItem('measurements', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const deleteMeasurement = async (index) => {
    const updated = measurements.filter((_, i) => i !== index);
    setMeasurements(updated);
    
    try {
      await storage.setItem('measurements', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  // Render cards using a simple function that returns an array
  const renderMeasurementCards = ( {item} ) => {
    <View>
      <Image source={{ uri: item.uri }} />
    </View>
    const cards = [];
    for (let i = 0; i < measurements.length; i++) {
      const item = measurements[i];
      cards.push(
        <View key={`card-${i}`} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardDate}>{item.date}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardText}>Bust: {item.bust} {item.unit}</Text>
            <Text style={styles.cardText}>Waist: {item.waist} {item.unit}</Text>
            <Text style={styles.cardText}>Height: {item.height} {item.unit}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteMeasurement(i)}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return cards;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Body Measurements Tracker</Text>

        <MeasurementForm 
          onPress={handleFormSubmit}
          unit={unit}
          setUnit={setUnit}
        />

        <View style={styles.history}>
          <Text style={styles.historyTitle}>Measurement History</Text>
          <Text style={{ color: '#666', marginBottom: 10 }}>
            Total measurements: {measurements.length}
          </Text>
          <ScrollView style={styles.measurementsList} contentContainerStyle={styles.measurementsContent}>
            {measurements.length > 0 ? (
              measurements.map((item, index) => {
                // Find the original index for delete functionality
                const originalIndex = measurements.findIndex(m => 
                  m.name === item.name && 
                  m.date === item.date && 
                  m.bust === item.bust
                );
                return (
                  <View key={index} style={styles.measurementCard}>
                    <View style={styles.measurementInfo}>
                      <Text style={styles.measurementName}>{item.name}</Text>
                      <Text style={styles.measurementDate}>{item.date}</Text>
                    </View>
                    <View style={styles.measurementDetails}>
                      <View style={styles.measurementStat}>
                        <Text style={styles.statLabel}>BUST</Text>
                        <Text style={styles.statValue}>{item.bust} {item.unit}</Text>
                      </View>
                      <View style={styles.measurementStat}>
                        <Text style={styles.statLabel}>WAIST</Text>
                        <Text style={styles.statValue}>{item.waist} {item.unit}</Text>
                      </View>
                      <View style={styles.measurementStat}>
                        <Text style={styles.statLabel}>HEIGHT</Text>
                        <Text style={styles.statValue}>{item.height} {item.unit}</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => deleteMeasurement(originalIndex)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteIcon}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  'No measurements found matching'
                </Text>
              </View>
            )}
          </ScrollView>
          {/* {renderMeasurementCards()}
          {measurements.length === 0 && (
            <Text style={styles.emptyText}>No measurements yet</Text>
          )} */}
          {/* <FlatList
            data={measurements}
            keyExtractor={(item, index) => item.uri + index}
            renderItem={renderMeasurementCards}
            numColumns={1}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No measurements yet. Tap "Open Camera" to add one.</Text>
              </View>
            }
          /> */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  unitToggle: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 4,
  },
  unitButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  unitButtonActive: {
    backgroundColor: '#fff',
  },
  unitText: {
    color: '#666',
    fontWeight: '600',
  },
  unitTextActive: {
    color: '#ffafcc',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#ffafcc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  history: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 100,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
  cardBody: {
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});