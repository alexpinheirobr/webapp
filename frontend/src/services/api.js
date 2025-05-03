import axios from 'axios';
import apiConfig from '../config/apiConfig';

const api = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api; 