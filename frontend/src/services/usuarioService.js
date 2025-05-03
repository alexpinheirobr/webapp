import api from './api';

const usuarioService = {
  getAllUsuarios: async () => {
    try {
      const response = await api.get('/usuario/all');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  getUsuarioById: async (id) => {
    try {
      const response = await api.get(`/usuario/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  createUsuario: async (usuarioData) => {
    try {
      const response = await api.post('/usuario/add', usuarioData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  updateUsuario: async (id, usuarioData) => {
    try {
      const response = await api.put(`/usuario/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  deleteUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuario/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
};

export default usuarioService; 