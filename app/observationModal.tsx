import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ObservationModal() {
  const router = useRouter();

  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);


  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      return Alert.alert(
        'Permission refusée',
        'Autorisez l’accès à la caméra dans les paramètres.'
      );
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) setPhoto(result.assets[0].uri);
  };


  const pickFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      return Alert.alert(
        'Permission refusée',
        'Autorisez l’accès à vos photos dans les paramètres.'
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = () => {
    console.log('Nouvelle observation :', { photo, name, date });
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>Ajouter une observation</Text>

        {/* Boutons photo */}
        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
          <Text style={styles.photoButtonText}>📷 Prendre une photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.photoButton} onPress={pickFromGallery}>
          <Text style={styles.photoButtonText}>🖼️ Choisir depuis la galerie</Text>
        </TouchableOpacity>

        {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}

        {/* Nom */}
        <TextInput
          style={styles.input}
          placeholder="Nom de l'observation"
          value={name}
          onChangeText={setName}
        />

        {/* Date */}
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
            onChange={handleDateChange}
            maximumDate={new Date()}
            locale="fr-FR" // iOS
          />
        )}

        {/* Boutons */}
        <View style={styles.buttons}>
          <Button title="Annuler" color="#888" onPress={() => router.back()} />
          <Button title="Enregistrer" onPress={handleSubmit} />
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


