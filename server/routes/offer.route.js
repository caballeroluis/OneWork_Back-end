const express = require('express');
const { check } = require('express-validator');

const verifyToken = require('../middlewares/verifyAuth.middleware');
const offerController = require('../controllers/offer.controller');

const router = express.Router()

router.post(
    '/worker/:idWorker/recruiter/:idRecruiter', 
    verifyToken, 
    offerController.createOffer
)

router.get(
    '/', 
    verifyToken,
    offerController.getOffer
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

