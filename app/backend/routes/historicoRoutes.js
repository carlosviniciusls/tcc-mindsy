const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');

router.post('/', historicoController.registrarHistorico);
router.get('/:usuarioId', historicoController.listarHistorico);

module.exports = router;
