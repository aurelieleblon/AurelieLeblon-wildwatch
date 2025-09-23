import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import MapboxGL from '../config/mapbox';
import { Location } from '../hooks/useCurrentPosition';
import { MapStyles, DEFAULT_CAMERA_CONFIG } from '../config/mapbox';
import { useRouter } from 'expo-router';

interface MapProps {
  location: Location;
  onRefresh: () => void;
}

export const Map: React.FC<MapProps> = ({ location, onRefresh }) => {
  const router = useRouter();
  const coord: [number, number] = [location.longitude, location.latitude];


  return (
    <MapboxGL.MapView style={styles.map}
     styleURL={MapStyles.STREET}
    onPress={(e) => {
      const { geometry } = e;
      console.log('Clic sur la carte:', geometry.coordinates);
      router.push('observationModal');
    }} >
      <MapboxGL.Camera
        zoomLevel={DEFAULT_CAMERA_CONFIG.zoomLevel}
        centerCoordinate={coord}
        animationMode={DEFAULT_CAMERA_CONFIG.animationMode}
        animationDuration={DEFAULT_CAMERA_CONFIG.animationDuration}
      />

      <MapboxGL.UserLocation
         visible={true}
         showsUserHeadingIndicator={true} // flèche directionnelle
       />
    </MapboxGL.MapView>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff', // couleur du picto
  },
});
