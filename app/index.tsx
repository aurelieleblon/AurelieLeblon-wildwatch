import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Button, Linking, Platform } from 'react-native';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import { Map } from '../components/Map';
import { TouchableOpacity } from 'react-native';


export default function App() {
  const { location, loading, error, permissionGranted, getLocation } = useCurrentPosition();

  // Écran de chargement
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.message}>Recherche de votre position...</Text>
      </View>
    );
  }

  // L'utilisateur n'a pas encore autorisé
  if (!permissionGranted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Autorisez la localisation</Text>
        <Text style={styles.message}>
          Cette application a besoin de votre position pour afficher la carte et votre emplacement.
        </Text>
        <TouchableOpacity style={styles.button} onPress={getLocation}>
          <Text style={styles.buttonText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Écran d'erreur
  if (error || !location) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Erreur</Text>
        <Text style={styles.message}>{error || 'Impossible d’obtenir la position'}</Text>
        <TouchableOpacity style={styles.button} onPress={getLocation}>
          <Text style={styles.buttonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Affichage de la carte
  return <Map location={location} onRefresh={getLocation} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f8ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#007AFF',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});