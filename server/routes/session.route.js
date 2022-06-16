const express = require('express');

const authController = require('../controllers/auth.controller');
const verifiyToken = require('../middlewares/verifyAuth.middleware');
// const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const { sessionValidator } = require('../middlewares/validators.middleware');

const router = express.Router();

/* POST /api/users/login  */
router.post(
    '/login',
    // authLimiter,
    sessionValidator,
    authController.userLogin
);

router.post(
    '/refreshToken',
    // authLimiter,
    authController.letsRefreshToken
);

router.post(
    '/logout',
    authController.userLogout
);

module.exports = router;