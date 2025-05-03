import axios from 'axios';
import googleMapsConfig from '../config/googleMapsConfig';

// Serviço para manipulação de mapas de calor
const heatmapService = {
  // Gerar mapa de calor a partir de fibras selecionadas
  generateHeatmapFromFibras: async (fibraIds, larguraMetros) => {
    try {
      // Verificar se há fibras selecionadas
      if (!fibraIds || fibraIds.length === 0) {
        throw new Error('Selecione pelo menos uma fibra');
      }
      
      // Verificar se a largura é válida
      if (!larguraMetros || larguraMetros <= 0) {
        throw new Error('Informe uma largura válida em metros');
      }
      
      // Fazer requisição à API para gerar o mapa de calor
      const response = await axios.post('/api/heatmap/fibra', {
        fibraIds,
        larguraMetros
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar mapa de calor por fibra:', error);
      throw error;
    }
  },
  
  // Gerar mapa de calor a partir de clientes por bairro
  generateHeatmapFromClientes: async (bairros, larguraMetros) => {
    try {
      // Verificar se há bairros selecionados
      if (!bairros || bairros.length === 0) {
        throw new Error('Selecione pelo menos um bairro');
      }
      
      // Verificar se a largura é válida
      if (!larguraMetros || larguraMetros <= 0) {
        throw new Error('Informe uma largura válida em metros');
      }
      
      // Fazer requisição à API para gerar o mapa de calor
      const response = await axios.post('/api/heatmap/cliente', {
        bairros,
        larguraMetros
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar mapa de calor por cliente:', error);
      throw error;
    }
  },
  
  // Converter GeoJSON para formato de dados do heatmap
  convertGeoJSONToHeatmapData: (geoJSON) => {
    try {
      if (!geoJSON || !geoJSON.features || !Array.isArray(geoJSON.features)) {
        throw new Error('GeoJSON inválido');
      }
      
      // Array para armazenar os pontos do heatmap
      const heatmapData = [];
      
      // Processar cada feature do GeoJSON
      geoJSON.features.forEach((feature) => {
        if (feature.geometry.type === 'Polygon') {
          // Para polígonos, usar os vértices como pontos do heatmap
          feature.geometry.coordinates[0].forEach((coord) => {
            heatmapData.push({
              lng: coord[0],
              lat: coord[1],
              weight: 1
            });
          });
        } else if (feature.geometry.type === 'Point') {
          // Para pontos, usar diretamente como pontos do heatmap
          heatmapData.push({
            lng: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
            weight: 1
          });
        }
      });
      
      return heatmapData;
    } catch (error) {
      console.error('Erro ao converter GeoJSON para dados de heatmap:', error);
      throw error;
    }
  },
  
  // Identificar prospects dentro de uma área de mapa de calor
  identifyProspectsInHeatmap: async (heatmapGeoJSON) => {
    try {
      // Esta função seria implementada quando tivermos a API para identificar prospects
      // Por enquanto, retornamos dados simulados
      
      // Simular uma lista de prospects identificados
      const mockProspects = [
        {
          id: '1',
          nome: 'Empresa Potencial A',
          segmento: 'Tecnologia',
          lat: -23.553140,
          lng: -46.642710
        },
        {
          id: '2',
          nome: 'Empresa Potencial B',
          segmento: 'Saúde',
          lat: -23.567250,
          lng: -46.693080
        },
        {
          id: '3',
          nome: 'Empresa Potencial C',
          segmento: 'Educação',
          lat: -23.550520,
          lng: -46.633308
        }
      ];
      
      return mockProspects;
    } catch (error) {
      console.error('Erro ao identificar prospects no mapa de calor:', error);
      throw error;
    }
  },
  
  // Salvar prospects identificados no banco de dados
  saveProspectsFromHeatmap: async (prospects, segmentos) => {
    try {
      // Verificar se há prospects para salvar
      if (!prospects || prospects.length === 0) {
        throw new Error('Nenhum prospect para salvar');
      }
      
      // Verificar se há segmentos selecionados
      if (!segmentos || segmentos.length === 0) {
        throw new Error('Selecione pelo menos um segmento');
      }
      
      // Filtrar prospects pelos segmentos selecionados
      const filteredProspects = prospects.filter(prospect => 
        segmentos.includes(prospect.segmento)
      );
      
      // Fazer requisição à API para salvar os prospects
      const response = await axios.post('/api/prospects/salvar-lote', {
        prospects: filteredProspects
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar prospects:', error);
      throw error;
    }
  }
};

export default heatmapService;
