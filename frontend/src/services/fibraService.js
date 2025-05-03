import api from './api';

const fibraService = {
  getAllFibras: async () => {
    try {
      const response = await api.get('/fibra/all');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar fibras:', error);
      throw error;
    }
  },

  getFibraById: async (id) => {
    try {
      const response = await api.get(`/fibra/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar fibra:', error);
      throw error;
    }
  },

  createFibra: async (fibraData) => {
    try {
      const response = await api.post('/fibra/add', fibraData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar fibra:', error);
      throw error;
    }
  },

  updateFibra: async (id, fibraData) => {
    try {
      const response = await api.put(`/fibra/${id}`, fibraData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar fibra:', error);
      throw error;
    }
  },

  deleteFibra: async (id) => {
    try {
      const response = await api.delete(`/fibra/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar fibra:', error);
      throw error;
    }
  }
};

export default fibraService; 