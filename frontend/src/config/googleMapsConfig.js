// Arquivo de configuração para a API do Google Maps

// Configuração com a chave da API fornecida pelo usuário
const googleMapsConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  defaultCenter: {
    lat: -3.7319,
    lng: -38.5267
  },
  defaultZoom: 12,
  libraries: ['places', 'visualization', 'drawing', 'geometry']
};

export default googleMapsConfig;
