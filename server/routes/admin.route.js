const express = require('express');
const { check } = require('express-validator');

const adminController = require('../controllers/admin.controller');
const verifyToken = require('../middlewares/verifyAuth.middleware');
const { verifyAdmin } = require('../middlewares/verifyRole.middleware');

const router = express.Router()

/* Session */

router.delete(
    '/session/:id', 
    verifyToken,
    verifyAdmin,
    adminController.deleteRefreshToken
)

/* Offers */

router.post(
    '/worker/:idWorker/recruiter/:idRecruiter', 
    verifyToken,
    verifyAdmin, 
    adminController.createOfferAdmin
)

router.get(
    '/offers', 
    verifyToken,
    verifyAdmin,
    adminController.getOffersAdmin

)
router.get(
    '/offers/:id', 
    verifyToken,
    verifyAdmin,
    adminController.getOfferByIDAdmin
)

router.patch(
    '/offers/:id', 
    verifyToken,
    verifyAdmin,
    adminController.changeStateOfferAdmin

)

router.put(
    '/offers/:id', 
    verifyToken,
    verifyAdmin,
    adminController.updateOfferAdmin
)

router.delete(
    '/offers/:id', 
    verifyToken,
    verifyAdmin,
    adminController.deleteOfferAdmin
)

/* Users */
router.post(
    '/users', 
    verifyToken,
    verifyAdmin,
    adminController.createUserAdmin
)

router.get(
    '/users', 
    verifyToken,
    verifyAdmin,
    adminController.getUsersAdmin
)

router.get(
    '/users/:id', 
    verifyToken,
    verifyAdmin,
    adminController.getUserByIDAdmin
)

router.put(
    '/users/:id', 
    verifyToken,
    verifyAdmin,
    adminController.updateUserAdmin
)

router.delete(
    '/users/:id', 
    verifyToken,
    verifyAdmin,
    adminController.deleteUserAdmin
)

/* Uploads */

router.delete(
    '/uploads/image/:id', 
    verifyToken,
    verifyAdmin,
    adminController.deleteImgAdmin
)

module.exports = router;
