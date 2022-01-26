const express = require('express');
const { check } = require('express-validator');

const verifyToken = require('../middlewares/verifyAuthMiddleware');
const offerController = require('../controllers/offerController');

const router = express.Router()

router.post(
    '/:idRecruiter/:idWorker', 
    verifyToken, 
    offerController.createOffer
)

router.patch(
    '/:type/:idO', 
    verifyToken,
    offerController.changeStateOffer
)


router.put(
    '/:id', 
    verifyToken,
    offerController.updateOffer
)

router.delete(
    '/:idO', 
    verifyToken,
    offerController.deleteOffer
)

module.exports = router;

