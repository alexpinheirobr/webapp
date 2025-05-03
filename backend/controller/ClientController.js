const express = require('express');
const router = express.Router();
const { ClienteModel } = require('../models/ClienteModel');

const createClient = async (req, res) => {
    try {
        const { 
          nome, endereco, complemento, bairro, cidade, uf, cep,
          segmento, executivo, servico, dataContrato, latitude, longitude 
        } = req.body;
        
        const cliente = new ClienteModel({
          nome, endereco, complemento, bairro, cidade, uf, cep,
          segmento, executivo, servico, dataContrato, latitude, longitude
        });
        
        const savedCliente = await cliente.save();
        res.status(201).json(savedCliente);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar cliente' });
    }
}

const getAllClients = async (req, res) => {
    try {
        const clientes = await ClienteModel.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar clientes' });
    }
}

const getClientById = async (req, res) => {
    try {
        const cliente = await ClienteModel.findByPk(req.params.id);
        res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar cliente' });
    }
}

const updateClient = async (req, res) => {
    try {
        const cliente = await ClienteModel.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        await cliente.update(req.body);
        res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar cliente' });
    }
}

const deleteClient = async (req, res) => {
    try {
        await ClienteModel.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar cliente' });
    }
}

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
}
