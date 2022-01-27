const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/verifyAuthMiddleware');
const { verifyRoleInitial } = require('../middlewares/verifyRoleMiddleware');


const router = express.Router();

/* POST /api/users  */

router.post(
  '/',
  [
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password must be a minimum of 6 characters').isLength({
      min: 6,
    }),
  ],
  userController.createUser
);

/* PUT /api/users  */

router.put(
  '/:id',
  userController.updateUser
)

/* GET /api/users/:email  */

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