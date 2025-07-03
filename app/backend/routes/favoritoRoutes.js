const express = require('express');
const router = express.Router();
const favoritoController = require('../controllers/favoritoController');

// Adicionar livro aos favoritos
router.post('/', favoritoController.adicionarFavorito);

// Remover livro dos favoritos
router.delete('/', favoritoController.removerFavorito);

// Listar favoritos de um usuário
router.get('/:usuarioId', favoritoController.listarFavoritos);

module.exports = router;
