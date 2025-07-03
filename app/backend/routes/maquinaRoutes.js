const express = require('express');
const router = express.Router();
const maquinaController = require('../controllers/maquinaController');

// Importante: rota mais específica primeiro
router.get('/livro/:livroId', maquinaController.maquinasPorLivro);
router.get('/:id/livros', maquinaController.livrosPorMaquina);
router.get('/', maquinaController.listarMaquinas);

module.exports = router;
