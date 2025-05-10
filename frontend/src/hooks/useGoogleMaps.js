import { useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_CONFIG = {
  googleMapsApiKey: 'AIzaSyBjPUWZRGVXyAGqG5Bv7NtkhziOf55C_ms',
  libraries: ['places', 'visualization'],
  language: 'pt-BR',
  region: 'BR',
  version: 'weekly'
};

export function useGoogleMaps() {
  return useJsApiLoader(GOOGLE_MAPS_CONFIG);
} 