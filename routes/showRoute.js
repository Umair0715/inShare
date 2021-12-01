const router = require('express').Router();
const showController = require('./../controllers/showController');

router.get('/:uuid' , showController.downloadPage);

module.exports = router;