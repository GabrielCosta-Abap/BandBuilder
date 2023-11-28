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
router.put("/:id", userController.updateUser);
router.get('/search_profiles/:searchValue/:category', userController.searchFeedProfiles);
router.post('/send_contact_solic/:senderId/:receiverId', userController.sendContactSolic);
router.get('/get_contact_solics/:receiverId', userController.getContactSolics);
router.put('/accept_reject_solicitation/:receiverId/:senderId/:solicitationStatus', userController.solicitationAcceptReject);
router.get('/get_contacts/:id', userController.getContacts);
router.get('/bandbuild/:id', userController.bandBuild);
//upload de imagem separado por enquanto.
router.post('/upload/', upload.single("file"), (req, res) => {
	return res.json(req.file.filename);
});
module.exports = router;
