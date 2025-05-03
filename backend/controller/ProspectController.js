const express = require('express');
const router = express.Router();
const { ProspectModel } = require('../models/ProspectModel');

const createProspect = async (req, res) => {
    try {
        const { 
          nome, endereco, complemento, bairro, cidade, uf, cep,
          segmento, executivo, servico, dataProspeccao, latitude, longitude 
        } = req.body;
        
        const prospect = new Prospect({
          nome, endereco, complemento, bairro, cidade, uf, cep,
          segmento, executivo, servico, dataProspeccao, latitude, longitude
        });
        
        const savedProspect = await prospect.save();
        res.status(201).json(savedProspect);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar prospect' });
    }
}

const getAllProspects = async (req, res) => {
    try {
        const prospects = await ProspectModel.findAll();
        res.status(200).json(prospects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar prospects' });
    }
}

const getProspectById = async (req, res) => {
    try {
        const prospect = await ProspectModel.findByPk(req.params.id);
        res.status(200).json(prospect);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar prospect' });
    }
}

const updateProspect = async (req, res) => {
    try {
        const prospect = await ProspectModel.findByPk(req.params.id);
        if (!prospect) {
            return res.status(404).json({ message: 'Prospect não encontrado' });
        }
        await prospect.update(req.body);
        res.status(200).json(prospect);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar prospect' });
    }
}

const deleteProspect = async (req, res) => {
    try {
        await ProspectModel.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Prospect deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar prospect' });
    }
}

module.exports = {
    createProspect,
    getAllProspects,
    getProspectById,
    updateProspect,
    deleteProspect
}

