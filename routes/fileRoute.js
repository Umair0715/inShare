const router = require('express').Router();
const fileController = require('../controllers/fileController');

router.post('/' ,fileController.multerUpload , fileController.uploadFile);
router.post('/send' , fileController.sendMail);

module.exports = router;