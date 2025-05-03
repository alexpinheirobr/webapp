const express = require('express');
const router = express.Router();
const Fibra = require('../models/Fibra');

// @desc    Obter todas as fibras
// @route   GET /api/fibras
// @access  Private
router.get('/', async (req, res) => {
  try {
    const fibras = await Fibra.findAll();
    res.json(fibras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar fibras' });
  }
});

// @desc    Obter uma fibra específica
// @route   GET /api/fibras/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const fibra = await Fibra.findByPk(req.params.id);
    
    if (!fibra) {
      return res.status(404).json({ message: 'Fibra não encontrada' });
    }
    
    res.json(fibra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar fibra' });
  }
});

// @desc    Criar uma nova fibra
// @route   POST /api/fibras
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { nome, quantidadeFo, propriedade } = req.body;
    
    const fibra = new Fibra({
      nome,
      quantidadeFo,
      propriedade
    });
    
    const savedFibra = await fibra.save();
    res.status(201).json(savedFibra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar fibra' });
  }
});

// @desc    Atualizar uma fibra
// @route   PUT /api/fibras/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { nome, quantidadeFo, propriedade } = req.body;
    
    const fibra = await Fibra.findById(req.params.id);
    
    if (!fibra) {
      return res.status(404).json({ message: 'Fibra não encontrada' });
    }
    
    fibra.nome = nome || fibra.nome;
    fibra.quantidadeFo = quantidadeFo || fibra.quantidadeFo;
    fibra.propriedade = propriedade || fibra.propriedade;
    fibra.updatedAt = Date.now();
    
    const updatedFibra = await fibra.save();
    res.json(updatedFibra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar fibra' });
  }
});

// @desc    Excluir uma fibra
// @route   DELETE /api/fibras/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const fibra = await Fibra.findById(req.params.id);
    
    if (!fibra) {
      return res.status(404).json({ message: 'Fibra não encontrada' });
    }
    
    await fibra.remove();
    res.json({ message: 'Fibra removida com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover fibra' });
  }
});

// @desc    Adicionar coordenadas a uma fibra
// @route   POST /api/fibras/:id/coordenadas
// @access  Private
router.post('/:id/coordenadas', async (req, res) => {
  try {
    const { coordenadas } = req.body;
    
    const fibra = await Fibra.findById(req.params.id);
    
    if (!fibra) {
      return res.status(404).json({ message: 'Fibra não encontrada' });
    }
    
    fibra.coordenadas = coordenadas;
    fibra.updatedAt = Date.now();
    
    const updatedFibra = await fibra.save();
    res.json(updatedFibra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar coordenadas' });
  }
});

module.exports = router;
