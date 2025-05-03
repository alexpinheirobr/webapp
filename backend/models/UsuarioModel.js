const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const UsuarioModel = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 40]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 60],
      isEmail: true
    }
  },
  senhaHash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  }
}, {
  timestamps: true,
  hooks: {
    // Substituindo o middleware pre('save') do Mongoose
    beforeCreate: async (usuario) => {
      if (usuario.senhaHash) {
        const salt = await bcrypt.genSalt(10);
        usuario.senhaHash = await bcrypt.hash(usuario.senhaHash, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      // Só faz hash da senha se ela foi modificada
      if (usuario.changed('senhaHash')) {
        const salt = await bcrypt.genSalt(10);
        usuario.senhaHash = await bcrypt.hash(usuario.senhaHash, salt);
      }
    }
  }
});

// Método para comparar senhas
UsuarioModel.prototype.matchPassword = async function(senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.senhaHash);
};

module.exports = { UsuarioModel };
