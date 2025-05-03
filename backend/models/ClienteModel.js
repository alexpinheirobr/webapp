const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ClienteModel = sequelize.define('Cliente', {
  nome: {
    type: String,
    required: true,
    maxlength: 100
  },
  endereco: {
    type: String,
    required: true,
    maxlength: 100
  },
  complemento: {
    type: String,
    maxlength: 40
  },
  bairro: {
    type: String,
    required: true,
    maxlength: 40
  },
  cidade: {
    type: String,
    required: true,
    maxlength: 40
  },
  uf: {
    type: String,
    required: true,
    maxlength: 2
  },
  cep: {
    type: String,
    required: true,
    maxlength: 8
  },
  segmento: {
    type: String,
    maxlength: 40
  },
  executivo: {
    type: String,
    maxlength: 40
  },
  servico: {
    type: String,
    maxlength: 40
  },
  dataContrato: {
    type: Date,
  },
  latitude: {
    type: String,
    maxlength: 20
  },
  longitude: {
    type: String,
    maxlength: 20
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = { ClienteModel };
