const express = require('express');
const { check } = require('express-validator');

const verifyToken = require('../middlewares/verifyAuthMiddleware');
const uploadController = require('../controllers/uploadController');
const uploadHandler = require('../middlewares/uploadFileMiddleware')
const router = express.Router();

router.patch(
    '/:type/:id',
    verifyToken,
    uploadHandler,
    uploadController.modifyImg

)

router.get(
    '/:type/:id/:name',
    uploadController.getImg
)

router.delete(
    '/:type/:id/:name', 
    uploadController.deleteImg
)


module.exports = router;