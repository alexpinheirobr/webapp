const express = require('express');
const router = express.Router();
const { UsuarioModel } = require('../models/UsuarioModel');

const createUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Verificar se o usuário já existe
        const usuarioExistente = await UsuarioModel.findOne({ email });
        
        if (usuarioExistente) {
          return res.status(400).json({ message: 'Usuário já existe' });
        }
        
        const usuario = new UsuarioModel({
          nome,
          email,
          senhaHash: senha
        });
        
        const savedUsuario = await usuario.save();
        
        res.status(201).json({
          _id: savedUsuario._id,
          nome: savedUsuario.nome,
          email: savedUsuario.email
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
}

const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioModel.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
}

const getUsuarioById = async (req, res) => {
    try {
        const usuario = await UsuarioModel.findByPk(req.params.id);
        res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
}

const updateUsuario = async (req, res) => {
    try {
        const usuario = await UsuarioModel.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        await usuario.update(req.body);
        res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
}

const deleteUsuario = async (req, res) => {
    try {
        await UsuarioModel.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
}

module.exports = {
    createUsuario,
    getAllUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
}