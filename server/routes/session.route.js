const express = require('express');

const authController = require('../controllers/auth.controller');
const verifiyToken = require('../middlewares/verifyAuth.middleware');
// const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const { sessionValidator } = require('../middlewares/validators.middleware');

const router = express.Router();

/* POST /api/users/login  */
router.post(
    '/login',
    // authLimiter, // TODO: rollback
    sessionValidator,
    authController.userLogin
);

router.post(
    '/refreshToken',
    // authLimiter, // TODO: rollback
    authController.letsRefreshToken
);

router.post(
    '/logout',
    verifiyToken,
    authController.userLogout
);

module.exports = router;