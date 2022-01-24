const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
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
    userController.userLogin
);

module.exports = router;