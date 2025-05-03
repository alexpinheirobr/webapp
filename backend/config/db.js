const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'prospecao_clientes',
  process.env.DB_USER || 'maps',
  process.env.DB_PASSWORD || 'maps',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mariadb', //mariadb
    port: process.env.DB_PORT || 3306,
    logging: false,
    dialectOptions: {
      authPlugin: 'mysql_native_password',
      connectTimeout: 30000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Sincronizar modelos com o banco de dados
    //await sequelize.sync();
    //console.log('Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
