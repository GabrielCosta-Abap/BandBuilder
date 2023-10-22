const express = require("express");
const bandController = require('../controller/banda_controller')
const router = express.Router();

router.get('/list_bands/', bandController.getBand);
router.get('/:id', bandController.searchById);
router.post('/insert_band/', bandController.insertBand);
//Definir se vamos ter login como banda diretamente.
//router.post('/login/', bandController.login);
router.delete('/delete_band/:id', bandController.deleteBand);
//A depender da definição do login como banda.
//router.get('/list_User_profiles/:id', bandController.getUserProfiles);

module.exports = router;