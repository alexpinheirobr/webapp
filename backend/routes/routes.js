const express = require('express');
const router = express.Router();
const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require('../controller/ClientController');
const { createProspect, getAllProspects, getProspectById, updateProspect, deleteProspect } = require('../controller/ProspectController');
const { createFibra, getAllFibras, getFibraById, updateFibra, deleteFibra } = require('../controller/FibraController');
const { createUsuario, getAllUsuarios, getUsuarioById, updateUsuario, deleteUsuario } = require('../controller/UsuarioController');

// Clients
// create a new client
router.post('/cliente/add', createClient);

// get all clients
router.get('/cliente/all', getAllClients);

// get a client by id
router.get('/cliente/:id', getClientById);

// update a client
router.put('/cliente/:id', updateClient);

// delete a client
router.delete('/cliente/:id', deleteClient);

// Prospects
// create a new prospect
router.post('/prospect/add', createProspect);

// get all prospects
router.get('/prospect/all', getAllProspects);

// get a prospect by id
router.get('/prospect/:id', getProspectById);

// update a prospect
router.put('/prospect/:id', updateProspect);

// delete a prospect
router.delete('/prospect/:id', deleteProspect);

// Fibras
// create a new fibra
router.post('/fibra/add', createFibra);

// get all fibras
router.get('/fibra/all', getAllFibras);

// get a fibra by id
router.get('/fibra/:id', getFibraById);

// update a fibra
router.put('/fibra/:id', updateFibra);

// delete a fibra
router.delete('/fibra/:id', deleteFibra);

// Usuarios
// create a new usuario
router.post('/usuario/add', createUsuario);

// get all usuarios
router.get('/usuario/all', getAllUsuarios);

// get a usuario by id
router.get('/usuario/:id', getUsuarioById);

// update a usuario
router.put('/usuario/:id', updateUsuario);

// delete a usuario
router.delete('/usuario/:id', deleteUsuario);

module.exports = router;
