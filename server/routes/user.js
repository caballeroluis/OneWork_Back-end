const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/verifyAuth');
const { verifyRoleInitial } = require('../middlewares/verifyRole');


const router = express.Router();

/* POST /api/users  */
router.post(
  '/:userType',
  [
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password must be a minimum of 6 characters').isLength({
      min: 6,
    }),
  ],
  userController.createUser
);

/* GET /api/users/:id  */
router.get(
  '/:id',
  userController.getUserByID
)

/* DELETE /api/users  */
router.delete(
    '/:id',
    userController.deleteUser
);


module.exports = router;