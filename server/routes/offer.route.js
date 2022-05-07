const express = require('express');

const verifyToken = require('../middlewares/verifyAuth.middleware');
const { verifyRecruiter } = require('../middlewares/verifyRole.middleware');
const offerController = require('../controllers/offer.controller');
const { offerValidator } = require('../middlewares/validators.middleware');

const router = express.Router()

router.post(
    '/worker/:idWorker/recruiter/:idRecruiter', 
    verifyToken,
    verifyRecruiter,
    offerValidator, 
    offerController.createOffer
)

router.get(
    '/',
    offerController.getOffers
)

router.get(
    '/:id',
    offerController.getOfferByID
)

router.patch(
    '/:id', 
    verifyToken,
    offerController.changeStateOffer
)

router.put(
    '/:id', 
    verifyToken,
    offerValidator,
    offerController.updateOffer
)

router.delete(
    '/:id', 
    verifyToken,
    offerController.deleteOffer
)

module.exports = router;

