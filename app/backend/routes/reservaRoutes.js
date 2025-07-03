const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Criar uma nova reserva
router.post('/', reservaController.criarReserva);

// Listar reservas ativas de um usuário
router.get('/usuario/:usuarioId', reservaController.reservasPorUsuario);

// Cancelar reserva (somente o dono pode)
router.put('/:id/cancelar', reservaController.cancelarReserva);

// Retirar livro (somente o dono pode)
router.put('/:id/retirar', reservaController.retirarLivro);

module.exports = router;
