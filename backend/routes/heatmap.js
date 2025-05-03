const express = require('express');
const router = express.Router();
const turf = require('@turf/turf');
const Fibra = require('../models/Fibra');
const Cliente = require('../models/Cliente');

// @desc    Gerar mapa de calor a partir de fibras selecionadas
// @route   POST /api/heatmap/fibra
// @access  Private
router.post('/fibra', async (req, res) => {
  try {
    const { fibraIds, larguraMetros } = req.body;
    
    if (!fibraIds || !Array.isArray(fibraIds) || fibraIds.length === 0) {
      return res.status(400).json({ message: 'Selecione pelo menos uma fibra' });
    }
    
    if (!larguraMetros || larguraMetros <= 0) {
      return res.status(400).json({ message: 'Informe uma largura válida em metros' });
    }
    
    // Buscar as fibras selecionadas
    const fibras = await Fibra.find({ _id: { $in: fibraIds } });
    
    if (fibras.length === 0) {
      return res.status(404).json({ message: 'Nenhuma fibra encontrada com os IDs fornecidos' });
    }
    
    // Criar um array de features para o mapa de calor
    const features = [];
    
    for (const fibra of fibras) {
      if (fibra.coordenadas.length < 2) {
        continue; // Ignorar fibras sem coordenadas suficientes
      }
      
      // Criar uma linha a partir das coordenadas da fibra
      const line = turf.lineString(fibra.coordenadas.map(coord => [coord.lng, coord.lat]));
      
      // Criar um buffer ao redor da linha com a largura especificada
      const buffer = turf.buffer(line, larguraMetros / 1000, { units: 'kilometers' });
      
      features.push({
        type: 'Feature',
        properties: {
          nome: fibra.nome,
          quantidadeFo: fibra.quantidadeFo,
          propriedade: fibra.propriedade
        },
        geometry: buffer.geometry
      });
    }
    
    // Criar um FeatureCollection com todos os buffers
    const heatmap = {
      type: 'FeatureCollection',
      features: features
    };
    
    res.json(heatmap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao gerar mapa de calor por fibra' });
  }
});

// @desc    Gerar mapa de calor a partir de clientes por bairro
// @route   POST /api/heatmap/cliente
// @access  Private
router.post('/cliente', async (req, res) => {
  try {
    const { bairros, larguraMetros } = req.body;
    
    if (!bairros || !Array.isArray(bairros) || bairros.length === 0) {
      return res.status(400).json({ message: 'Selecione pelo menos um bairro' });
    }
    
    if (!larguraMetros || larguraMetros <= 0) {
      return res.status(400).json({ message: 'Informe uma largura válida em metros' });
    }
    
    // Buscar os clientes dos bairros selecionados
    const clientes = await Cliente.find({ bairro: { $in: bairros } });
    
    if (clientes.length === 0) {
      return res.status(404).json({ message: 'Nenhum cliente encontrado nos bairros selecionados' });
    }
    
    // Criar um array de features para o mapa de calor
    const features = [];
    
    for (const cliente of clientes) {
      if (!cliente.latitude || !cliente.longitude) {
        continue; // Ignorar clientes sem coordenadas
      }
      
      // Criar um ponto a partir das coordenadas do cliente
      const point = turf.point([parseFloat(cliente.longitude), parseFloat(cliente.latitude)]);
      
      // Criar um buffer ao redor do ponto com a largura especificada
      const buffer = turf.buffer(point, larguraMetros / 1000, { units: 'kilometers' });
      
      features.push({
        type: 'Feature',
        properties: {
          nome: cliente.nome,
          bairro: cliente.bairro,
          segmento: cliente.segmento
        },
        geometry: buffer.geometry
      });
    }
    
    // Criar um FeatureCollection com todos os buffers
    const heatmap = {
      type: 'FeatureCollection',
      features: features
    };
    
    res.json(heatmap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao gerar mapa de calor por cliente' });
  }
});

module.exports = router;
