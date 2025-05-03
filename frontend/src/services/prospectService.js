import api from './api';

// Serviço para manipulação de dados de prospects
const prospectService = {
  // Buscar todos os prospects
  getAllProspects: async () => {
    try {
      const response = await api.get('/prospect/all');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prospects:', error);
      throw error;
    }
  },
  
  // Buscar prospects por segmento
  getProspectsBySegmento: async (segmento) => {
    try {
      const response = await api.get(`/prospects/segmento/${segmento}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar prospects do segmento ${segmento}:`, error);
      throw error;
    }
  },
  
  // Verificar se um prospect já existe
  checkProspectExists: async (nome, endereco) => {
    try {
      const response = await api.post('/prospects/verificar', { nome, endereco });
      return response.data.existe;
    } catch (error) {
      console.error('Erro ao verificar existência de prospect:', error);
      throw error;
    }
  },
  
  // Salvar um novo prospect
  createProspect: async (prospectData) => {
    try {
      const response = await api.post('/prospect/add', prospectData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar prospect:', error);
      throw error;
    }
  },
  
  // Salvar múltiplos prospects
  saveMultipleProspects: async (prospects, segmentos = []) => {
    try {
      // Filtrar por segmentos, se especificados
      let prospectsToSave = prospects;
      if (segmentos.length > 0) {
        prospectsToSave = prospects.filter(p => segmentos.includes(p.segmento));
      }
      
      // Verificar e salvar cada prospect
      const results = {
        total: prospectsToSave.length,
        salvos: 0,
        existentes: 0,
        erros: 0
      };
      
      for (const prospect of prospectsToSave) {
        try {
          // Verificar se já existe
          const existe = await prospectService.checkProspectExists(
            prospect.nome, 
            prospect.endereco
          );
          
          if (existe) {
            results.existentes++;
            continue;
          }
          
          // Salvar o prospect
          await api.post('/prospects', prospect);
          results.salvos++;
        } catch (error) {
          console.error('Erro ao salvar prospect:', error);
          results.erros++;
        }
      }
      
      return results;
    } catch (error) {
      console.error('Erro ao salvar múltiplos prospects:', error);
      throw error;
    }
  },

  getProspectById: async (id) => {
    try {
      const response = await api.get(`/prospect/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prospect:', error);
      throw error;
    }
  },

  updateProspect: async (id, prospectData) => {
    try {
      const response = await api.put(`/prospect/${id}`, prospectData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar prospect:', error);
      throw error;
    }
  },

  deleteProspect: async (id) => {
    try {
      const response = await api.delete(`/prospect/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar prospect:', error);
      throw error;
    }
  }
};

export default prospectService;
