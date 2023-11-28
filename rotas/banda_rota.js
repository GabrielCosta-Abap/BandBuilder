const express = require("express");
const bandController = require('../controller/banda_controller')
const router = express.Router();

router.get('/list_bands/', bandController.getBand);
router.get('/:id', bandController.searchById);
router.post('/insert_band/', bandController.insertBand);
router.delete('/delete_band/:id', bandController.deleteBand);
router.put("/:id", bandController.updateBand);


module.exports = router;