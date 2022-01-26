const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const { check } = require('express-validator');


/* POST /api/users/login  */
router.post(
    '/',
    [
      check('email', 'Enter a valid email').isEmail(),
      check('password', 'Password must be a minimum of 6 characters').isLength({
        min: 6,
      }),
    ],
    loginController.userLogin
);

module.exports = router;