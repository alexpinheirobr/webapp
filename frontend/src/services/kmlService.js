import axios from 'axios';

// Serviço para importação de arquivos KML
const kmlService = {
  // Importar arquivo KML de malha de fibra
  importKML: async (file) => {
    try {
      // Verificar se o arquivo é do tipo KML
      if (!file.name.endsWith('.kml') && file.type !== 'application/vnd.google-earth.kml+xml') {
        throw new Error('Arquivo inválido. Por favor, selecione um arquivo KML.');
      }
      
      // Criar FormData para envio do arquivo
      const formData = new FormData();
      formData.append('kmlFile', file);
      
      // Fazer requisição à API para importar o arquivo KML
      const response = await axios.post('/api/kml/importar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao importar arquivo KML:', error);
      throw error;
    }
  },
  
  // Converter coordenadas de KML para formato utilizável pelo Google Maps
  parseKMLCoordinates: (kmlCoordinatesString) => {
    try {
      // Dividir a string de coordenadas em pares
      const coordPairs = kmlCoordinatesString.trim().split(' ');
      
      // Converter cada par em um objeto de coordenadas
      const coordinates = coordPairs.map(pair => {
        const [lng, lat, alt] = pair.split(',');
        return { 
          lat: parseFloat(lat), 
          lng: parseFloat(lng)
        };
      });
      
      return coordinates;
    } catch (error) {
      console.error('Erro ao processar coordenadas KML:', error);
      throw error;
    }
  }
};

export default kmlService;
