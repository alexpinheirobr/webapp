import api from './api';

const clientService = {
  getAllClients: async () => {
    try {
      const response = await api.get('/cliente/all');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  },

  getClientById: async (id) => {
    try {
      const response = await api.get(`/cliente/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  },

  createClient: async (clientData) => {
    try {
      const response = await api.post('/cliente/add', clientData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  updateClient: async (id, clientData) => {
    try {
      const response = await api.put(`/cliente/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  },

  deleteClient: async (id) => {
    try {
      const response = await api.delete(`/cliente/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  }
};

export default clientService; 