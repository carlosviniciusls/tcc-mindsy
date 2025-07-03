const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');

// Buscar todos os livros
router.get('/', livroController.listarLivros);

// Buscar livro por título (via query ?titulo=)
router.get('/buscar', livroController.buscarLivroPorTitulo);

// Buscar livro por ID
router.get('/:id', livroController.detalhesLivro);

// Filtrar livros por tipo: pessoal ou profissional
router.get('/filtro/tipo/:tipo', livroController.filtrarPorTipo);

// Filtrar livros por ID da máquina (somente disponíveis)
router.get('/filtro/maquina/:maquinaId', livroController.filtrarPorMaquina);

module.exports = router;
