const express = require('express');
const { check } = require('express-validator');

const verifyToken = require('../middlewares/verifyAuth.middleware');
const offerController = require('../controllers/offer.controller');

const router = express.Router()

router.get(
    '/offers', 
    verifyToken, 

)

router.patch(
    '/offers/:id', 
    verifyToken,

)

router.put(
    '/offers/:id', 
    verifyToken,

)

router.delete(
    '/offers/:id', 
    verifyToken,

)

router.get(
    '/users', 
    verifyToken,

)

router.put(
    '/users/:id', 
    verifyToken,
)

router.delete(
    '/users/:id', 
    verifyToken,

)


module.exports = router;
