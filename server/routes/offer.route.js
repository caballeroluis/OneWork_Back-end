const express = require('express');
const { check } = require('express-validator');

const verifyToken = require('../middlewares/verifyAuth.middleware');
const { verifyRecruiter, verifyOfferAsigned } = require('../middlewares/verifyRole.middleware');
const offerController = require('../controllers/offer.controller');

const router = express.Router()

router.post(
    '/worker/:idWorker/recruiter/:idRecruiter', 
    verifyToken,
    verifyRecruiter, 
    offerController.createOffer
)

router.get(
    '/', 
    verifyToken,
    offerController.getOffers
)

router.get(
    '/:id', 
    verifyToken,
    offerController.getOfferByID
)

router.patch(
    '/:id', 
    verifyToken,
    verifyOfferAsigned,
    offerController.changeStateOffer
)


router.put(
    '/:id', 
    verifyToken,
    verifyOfferAsigned,
    offerController.updateOffer
)

router.delete(
    '/:id', 
    verifyToken,
    verifyOfferAsigned,
    offerController.deleteOffer
)

module.exports = router;

