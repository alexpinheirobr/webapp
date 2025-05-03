const express = require('express');
const router = express.Router();
const axios = require('axios');

// @desc    Obter coordenadas a partir de um endereço
// @route   POST /api/geocode
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { endereco, complemento, bairro, cidade, uf, cep } = req.body;
    
    // Montar o endereço completo para geocodificação
    const enderecoCompleto = `${endereco}, ${complemento ? complemento + ', ' : ''}${bairro}, ${cidade}, ${uf}, ${cep}, Brasil`;
    
    // Verificar se a API_KEY do Google Maps está configurada
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        message: 'Chave da API do Google Maps não configurada',
        error: 'API_KEY_MISSING'
      });
    }
    
    // Fazer requisição à API de Geocodificação do Google Maps
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: enderecoCompleto,
        key: apiKey
      }
    });
    
    // Verificar se a requisição foi bem-sucedida
    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        message: 'Não foi possível obter as coordenadas para o endereço informado',
        error: response.data.status
      });
    }
    
    // Extrair as coordenadas do resultado
    const location = response.data.results[0].geometry.location;
    
    res.json({
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      endereco_formatado: response.data.results[0].formatted_address
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter coordenadas' });
  }
});

module.exports = router;
