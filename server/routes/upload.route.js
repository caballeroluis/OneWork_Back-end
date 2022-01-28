const express = require('express');
const { check } = require('express-validator');

const verifyToken = require('../middlewares/verifyAuth.middleware');
const uploadController = require('../controllers/upload.controller');
const uploadHandler = require('../middlewares/uploadFile.middleware')
const router = express.Router();

router.patch(
    '/images/:id',
    verifyToken,
    uploadHandler,
    uploadController.modifyImg

)

router.get(
    '/images/:id',
    uploadController.getImg
)

router.delete(
    '/images/:id/', 
    uploadController.deleteImg
)


module.exports = router;