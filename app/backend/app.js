// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
const livroRoutes = require('./routes/livroRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const maquinaRoutes = require('./routes/maquinaRoutes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/livros', livroRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/maquinas', maquinaRoutes);

// Rota 404 para rotas inválidas
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
