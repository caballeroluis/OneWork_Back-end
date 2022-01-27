const express = require('express');
const { check } = require('express-validator');

const verifyToken = require('../middlewares/verifyAuthMiddleware');
const offerController = require('../controllers/offerController');

const router = express.Router()

router.post(
    '/worker/:idWorker/recruiter/:idRecruiter', 
    verifyToken, 
    offerController.createOffer
)

router.patch(
    '/:id', 
    verifyToken,
    offerController.changeStateOffer
)


router.put(
    '/:id', 
    verifyToken,
    offerController.updateOffer
)

router.delete(
    '/:id', 
    verifyToken,
    offerController.deleteOffer
)

module.exports = router;

