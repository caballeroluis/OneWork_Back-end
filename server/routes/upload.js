const express = require('express');
const { check } = require('express-validator');

const verifyToken = require('../middlewares/verifyAuthMiddleware');
const uploadController = require('../controllers/uploadController');
const uploadHandler = require('../middlewares/uploadFileMiddleware')
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