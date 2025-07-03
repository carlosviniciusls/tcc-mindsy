const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/:id', usuarioController.obterUsuarioPorId);
router.post('/registrar', usuarioController.criarUsuario);
router.post('/login', usuarioController.login);
router.put('/:id', usuarioController.atualizarUsuario);

module.exports = router;