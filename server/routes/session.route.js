const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { check } = require('express-validator');


/* POST /api/users/login  */
router.post(
    '/login',
    [
      check('email', 'Enter a valid email').isEmail(),
      check('password', 'Password must be a minimum of 6 characters').isLength({
        min: 6,
      }),
    ],
    authController.userLogin
);

router.post(
  '/logout',
  authController.userLogout
);

module.exports = router;