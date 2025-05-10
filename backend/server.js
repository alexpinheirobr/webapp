require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const router = require('./routes/routes');

// Conectar ao banco de dados
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL || 'http://localhost:3000')
    : '*',
  credentials: true
}));

// Criar diretório de uploads se não existir
const fs = require('fs');
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/', router);

// Definir rotas
/* app.use('/fibras', require('./routes/routes'));
app.use('/clientes', require('./routes/routes'));
app.use('/prospects', require('./routes/routes'));
app.use('/usuarios', require('./routes/routes')); */

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API de Prospecção de Clientes para Links está funcionando!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
