const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// @desc    Obter todos os usuários
// @route   GET /api/usuarios
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['senhaHash'] } });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

// @desc    Obter um usuário específico
// @route   GET /api/usuarios/:id
// @access  Admin
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: { exclude: ['senhaHash'] } });
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
});

// @desc    Criar um novo usuário
// @route   POST /api/usuarios
// @access  Admin
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ email });
    
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }
    
    const usuario = new Usuario({
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
});

// @desc    Atualizar um usuário
// @route   PUT /api/usuarios/:id
// @access  Admin
router.put('/:id', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    usuario.nome = nome || usuario.nome;
    usuario.email = email || usuario.email;
    
    if (senha) {
      usuario.senhaHash = senha;
    }
    
    usuario.updatedAt = Date.now();
    
    const updatedUsuario = await usuario.save();
    
    res.json({
      _id: updatedUsuario._id,
      nome: updatedUsuario.nome,
      email: updatedUsuario.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// @desc    Excluir um usuário
// @route   DELETE /api/usuarios/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    await usuario.deleteOne();
    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover usuário' });
  }
});

// @desc    Autenticar usuário e gerar token
// @route   POST /api/usuarios/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ email });
    
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Verificar senha
    const senhaCorreta = await usuario.matchPassword(senha);
    
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET || 'secrettemporaria',
      { expiresIn: '1d' }
    );
    
    res.json({
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

module.exports = router;
