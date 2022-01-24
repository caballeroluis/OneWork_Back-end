const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');
const upload = multer({dest: '/uploads', storage: storage});

const verifyToken = require('../middlewares/verifyAuth');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.DIR)
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
});

router.put(
    '/:type/:id', [upload.single('file'), uploadController.modifyImg],

)

router.get(
    '/file/:type/:id/:name',
    uploadController.getImg
)

router.delete(
    '/file/:type/:id/:name', 
    uploadController.deleteImg
)


module.exports = router;