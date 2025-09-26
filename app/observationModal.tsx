import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
  Platform,
  Alert,
  TouchableWithoutFeedback, // 👈 AJOUT
  KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCurrentPosition } from '../hooks/useCurrentPosition';

export default function ObservationModal() {
  const router = useRouter();
  const { location, loading, getLocation } = useCurrentPosition();

  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return Alert.alert('Permission refusée', 'Autorisez la caméra.');
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert('Permission refusée', 'Autorisez vos photos.');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleDateChange = (event: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) setDate(selected);
  };

  const handleSubmit = async () => {
    if (!location) {
      return Alert.alert('Erreur', 'Position non disponible.');
    }

    try {
      const newObservation = {
        id: Date.now().toString(),
        name,
        date: date.toISOString(),
        photo,
        coordinate: [location.longitude, location.latitude],
      };

      const stored = await AsyncStorage.getItem('observations');
      const list = stored ? JSON.parse(stored) : [];
      list.push(newObservation);
      await AsyncStorage.setItem('observations', JSON.stringify(list));

      router.back();
    } catch (e) {
      console.error('Erreur enregistrement', e);
    }
  };

  if (loading || !location) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement de la position…</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => router.back()}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <KeyboardAvoidingView
            style={styles.modal}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Text style={styles.title}>Ajouter une observation</Text>

            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text style={styles.photoButtonText}>📷 Prendre une photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoButton} onPress={pickFromGallery}>
              <Text style={styles.photoButtonText}>🖼️ Choisir depuis la galerie</Text>
            </TouchableOpacity>

            {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}

            <TextInput
              style={styles.input}
              placeholder="Nom de l'observation"
              value={name}
              onChangeText={setName}
            />

            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text>{date.toLocaleDateString('fr-FR')}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            )}

            <View style={styles.buttons}>
              <Button title="Annuler" color="#888" onPress={() => router.back()} />
              <Button title="Enregistrer" onPress={handleSubmit} />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  photoButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  photoButtonText: { color: '#fff', fontWeight: 'bold' },
  photoPreview: { width: '100%', height: 150, borderRadius: 8, marginBottom: 12 },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' },
});
