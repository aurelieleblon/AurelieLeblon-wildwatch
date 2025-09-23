import MapboxGL from '@rnmapbox/maps';

// Token public pour l'app
MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic3JheW5hdWQtbGFtb2JpbGVyeSIsImEiOiJjbWZmdTRienQwb2F4MmtzYmprNWxieWZwIn0.mgySs3rW_6jA7hEKCF7ycw'
);

export const MapStyles = {
  STREET: 'mapbox://styles/mapbox/streets-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
} as const;

export const DEFAULT_CAMERA_CONFIG = {
  zoomLevel: 15,
  animationMode: 'flyTo' as const,
  animationDuration: 1000,
};

export default MapboxGL;
