const express = require("express");
const userController = require('../controller/usuario_controller')
const router = express.Router();
const multer = require('multer');
const storage = require('../configs/multerConfig')
const upload = multer({storage: storage});

router.get('/list_users/', userController.getUsers);
router.get('/:id', userController.searchById);
router.post('/insert_user/', userController.insertUser);
router.post('/login/', userController.login);
router.delete('/delete_user/:id', userController.deleteUser);
router.get('/list_User_profiles/:id', userController.getUserProfiles);
router.get('/search_profiles/:searchValue/:category', userController.searchFeedProfiles);
//upload de imagem separado por enquanto.
router.post('/upload/', upload.single("file"), (req, res) => {
	return res.json(req.file.filename);
});
module.exports = router;
