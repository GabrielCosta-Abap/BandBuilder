const express = require("express");
const userController = require('../controller/usuario_controller')
const router = express.Router();

router.get('/list_users/', userController.getUsers);
router.get('/:id', userController.searchById);
router.post('/insert_user/', userController.insertUser);
router.post('/login/', userController.login);

module.exports = router;
