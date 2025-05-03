const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FibraModel = sequelize.define('Fibra', {
  nome: {
    type: String,
    required: true,
    maxlength: 40
  },
  quantidadeFo: {
    type: Number,
    required: true,
    min: 1,
    max: 99
  },
  propriedade: {
    type: String,
    maxlength: 20
  },
  coordenadas: {
    type: [{
      lat: Number,
      lng: Number
    }],
    default: []
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

module.exports = { FibraModel };
