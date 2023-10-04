const express = require("express");
const oUsuarioController = require('../controller/usuario_controller')
const router = express.Router();

router.get('/', oUsuarioController.getUsuarios)

module.exports = router;
