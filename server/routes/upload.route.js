const express = require('express');
const { check } = require('express-validator');

const verifyToken = require('../middlewares/verifyAuth.middleware');
const { verifyOwnId } = require('../middlewares/verifyRole.middleware');
const uploadController = require('../controllers/upload.controller');
const uploadHandler = require('../middlewares/uploadFile.middleware');

const router = express.Router();

router.patch(
    '/images/:id',
    verifyToken,
    verifyOwnId,
    uploadHandler,
    uploadController.modifyImg
)

router.get(
    '/images/:id',
    uploadController.getImg
)

router.delete(
    '/images/:id/',
    verifyToken,
    verifyOwnId,
    uploadController.deleteImg
)


module.exports = router;