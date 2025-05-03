const express = require('express');
const router = express.Router();
const { FibraModel } = require('../models/FibraModel');

const createFibra = async (req, res) => {
    try {
        const { nome, quantidadeFo, propriedade } = req.body;
        
        const fibra = new FibraModel({
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
}

const getAllFibras = async (req, res) => {
    try {
        const fibras = await FibraModel.findAll();
        res.status(200).json(fibras);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar fibras' });
    }
}

const getFibraById = async (req, res) => {
    try {
        const fibra = await FibraModel.findByPk(req.params.id);
        res.status(200).json(fibra);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar fibra' });
    }
}

const updateFibra = async (req, res) => {
    try {
        const fibra = await FibraModel.findByPk(req.params.id);
        if (!fibra) {
            return res.status(404).json({ message: 'Fibra não encontrada' });
        }
        await fibra.update(req.body);
        res.status(200).json(fibra);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar fibra' });
    }
}

const deleteFibra = async (req, res) => {
    try {
        await FibraModel.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Fibra deletada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar fibra' });
    }
}

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

module.exports = {
    createFibra,
    getAllFibras,
    getFibraById,
    updateFibra,
    deleteFibra
}