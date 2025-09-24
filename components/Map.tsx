import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MapboxGL from '../config/mapbox';
import { Location } from '../hooks/useCurrentPosition';
import { MapStyles, DEFAULT_CAMERA_CONFIG } from '../config/mapbox';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MapProps {
  location: Location;
  onRefresh: () => void;
}

export const Map: React.FC<MapProps> = ({ location }) => {
  const router = useRouter();
  const coord: [number, number] = [location.longitude, location.latitude];

  const [lastObservation, setLastObservation] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadObservations = async () => {
    const stored = await AsyncStorage.getItem('observations');
    const parsed = stored ? JSON.parse(stored) : [];
    setLastObservation(parsed.length > 0 ? parsed[parsed.length - 1] : null);
  };

  useFocusEffect(
    useCallback(() => {
      loadObservations();
      setRefreshKey(k => k + 1);
    }, [])
  );

  return (
    <MapboxGL.MapView
      key={refreshKey}
      style={styles.map}
      styleURL={MapStyles.STREET}
      onPress={() => router.push('observationModal')}
    >
      <MapboxGL.Camera
        zoomLevel={DEFAULT_CAMERA_CONFIG.zoomLevel}
        centerCoordinate={coord}
        animationMode={DEFAULT_CAMERA_CONFIG.animationMode}
        animationDuration={DEFAULT_CAMERA_CONFIG.animationDuration}
      />

      <MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} />

      {lastObservation && (
        <MapboxGL.PointAnnotation id="observation" coordinate={coord}>
          <View style={styles.annotationContainer}>
            <View style={styles.annotationBubble}>
              <Text style={styles.obsTitle}>{lastObservation.name}</Text>
              <Text style={styles.obsDate}>
                {new Date(lastObservation.date).toLocaleDateString('fr-FR')}
              </Text>
              {lastObservation.photo && (
                <Image source={{ uri: lastObservation.photo }} style={styles.photo} />
              )}
            </View>
            <View style={styles.arrowDown} />
          </View>
        </MapboxGL.PointAnnotation>
      )}
    </MapboxGL.MapView>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
  annotationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -100 }],
  },
  annotationBubble: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    maxWidth: 200,
    alignItems: 'center',
  },
  obsTitle: { fontWeight: 'bold', fontSize: 14 },
  obsDate: { fontSize: 12, color: '#666', marginBottom: 4 },
  photo: { width: 100, height: 80, borderRadius: 6 },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    marginTop: -2,
  },
});

