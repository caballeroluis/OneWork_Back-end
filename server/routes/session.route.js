const express = require('express');

const authController = require('../controllers/auth.controller');
const { check } = require('express-validator');
const verifiyToken = require('../middlewares/verifyAuth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

/* POST /api/users/login  */
router.post(
    '/login',
    authLimiter,
    [
      check('email', 'Enter a valid email').isEmail(),
      check('password', 'Password must be a minimum of 6 characters').isLength({
        min: 6,
      }),
    ],
    authController.userLogin
);

router.post(
    '/refreshToken',
    authLimiter,
    authController.letsRefreshToken
);

router.post(
    '/logout',
    verifiyToken,
    authController.userLogout
);

module.exports = router;