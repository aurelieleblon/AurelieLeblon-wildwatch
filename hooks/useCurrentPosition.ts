import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export const useCurrentPosition = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permission de localisation',
          message: 'Cette application a besoin de votre position pour afficher la carte.',
          buttonNeutral: 'Plus tard',
          buttonNegative: 'Annuler',
          buttonPositive: 'Autoriser',
        }
      );
      const allowed = granted === PermissionsAndroid.RESULTS.GRANTED;
      setPermissionGranted(allowed);
      return allowed;
    } else {
      setPermissionGranted(true); // iOS gère automatiquement
      return true;
    }
  };

  const getLocation = async () => {
    setLoading(true);
    setError(null);

    const hasPermission = await requestPermission();
    if (!hasPermission) {
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setLocation({ latitude, longitude, accuracy });
        setLoading(false);
      },
      (err) => {
        console.log('Erreur localisation:', err);
        let msg = 'Impossible d’obtenir la position';
        if (err.code === 1) msg = 'Permission refusée';
        else if (err.code === 2) msg = 'Position non disponible';
        else if (err.code === 3) msg = 'Délai dépassé';
        setError(msg);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    // on attend que l'utilisateur clique pour autoriser
    setLoading(false);
  }, []);

  return { location, loading, error, permissionGranted, requestPermission, getLocation };
};

