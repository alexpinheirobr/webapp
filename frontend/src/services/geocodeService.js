import axios from 'axios';
import googleMapsConfig from '../config/googleMapsConfig';

// Serviço para geocodificação de endereços
const geocodeService = {
  // Obter coordenadas a partir de um endereço
  getCoordinates: async (endereco, complemento, bairro, cidade, uf, cep) => {
    try {
      // Verificar se a API Key está configurada
      if (!googleMapsConfig.apiKey || googleMapsConfig.apiKey === 'SUA_CHAVE_API_AQUI') {
        throw new Error('Chave da API do Google Maps não configurada');
      }

      // Montar o endereço completo
      const enderecoCompleto = `${endereco}, ${complemento ? complemento + ', ' : ''}${bairro}, ${cidade}, ${uf}, ${cep}, Brasil`;
      
      // Fazer requisição à API de Geocodificação do Google Maps
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: enderecoCompleto,
          key: googleMapsConfig.apiKey
        }
      });
      
      // Verificar se a requisição foi bem-sucedida
      if (response.data.status !== 'OK') {
        throw new Error(`Erro na geocodificação: ${response.data.status}`);
      }
      
      // Extrair as coordenadas do resultado
      const location = response.data.results[0].geometry.location;
      
      return {
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        endereco_formatado: response.data.results[0].formatted_address
      };
    } catch (error) {
      console.error('Erro ao obter coordenadas:', error);
      throw error;
    }
  },

  // Obter endereço a partir de coordenadas (geocodificação reversa)
  getAddressFromCoordinates: async (latitude, longitude) => {
    try {
      // Verificar se a API Key está configurada
      if (!googleMapsConfig.apiKey || googleMapsConfig.apiKey === 'SUA_CHAVE_API_AQUI') {
        throw new Error('Chave da API do Google Maps não configurada');
      }
      
      // Fazer requisição à API de Geocodificação Reversa do Google Maps
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${latitude},${longitude}`,
          key: googleMapsConfig.apiKey
        }
      });
      
      // Verificar se a requisição foi bem-sucedida
      if (response.data.status !== 'OK') {
        throw new Error(`Erro na geocodificação reversa: ${response.data.status}`);
      }
      
      // Extrair o endereço do resultado
      const result = response.data.results[0];
      
      // Processar os componentes do endereço
      const addressComponents = result.address_components;
      let endereco = '';
      let complemento = '';
      let bairro = '';
      let cidade = '';
      let uf = '';
      let cep = '';
      
      addressComponents.forEach((component) => {
        const types = component.types;
        
        if (types.includes('route')) {
          endereco = component.long_name;
        } else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
          bairro = component.long_name;
        } else if (types.includes('administrative_area_level_2')) {
          cidade = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          uf = component.short_name;
        } else if (types.includes('postal_code')) {
          cep = component.long_name.replace('-', '');
        }
      });
      
      return {
        endereco,
        complemento,
        bairro,
        cidade,
        uf,
        cep,
        endereco_formatado: result.formatted_address
      };
    } catch (error) {
      console.error('Erro ao obter endereço a partir de coordenadas:', error);
      throw error;
    }
  }
};

export default geocodeService;
