import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditObservationModal() {
  const router = useRouter();
  const { id, name: initName, date: initDate } = useLocalSearchParams();
  const [name, setName] = useState(String(initName || ''));
  const [date, setDate] = useState(
    initDate ? new Date(String(initDate)) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveChanges = async () => {
    const stored = await AsyncStorage.getItem('observations');
    const list = stored ? JSON.parse(stored) : [];
    const updated = list.map((o: any) =>
      o.id === id ? { ...o, name, date: date.toISOString() } : o
    );
    await AsyncStorage.setItem('observations', JSON.stringify(updated));
    router.back();
  };

  const deleteObservation = async () => {
    const stored = await AsyncStorage.getItem('observations');
    const list = stored ? JSON.parse(stored) : [];
    const filtered = list.filter((o: any) => o.id !== id);
    await AsyncStorage.setItem('observations', JSON.stringify(filtered));
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>Modifier l'observation</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{date.toLocaleDateString('fr-FR')}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(_, selected) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selected) setDate(selected);
            }}
          />
        )}

        <View style={styles.buttons}>
          <Button title="Enregistrer" onPress={saveChanges} />
          <Button title="Supprimer" color="red" onPress={deleteObservation} />
          <Button title="Annuler" color="#888" onPress={() => router.back()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center'
  },
  buttons: { marginTop: 12 }
});
