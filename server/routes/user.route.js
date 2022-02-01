const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyAuth.middleware');
const { verifyOwnId, verifyOwnIdOrRecruiter } = require('../middlewares/verifyRole.middleware');


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

/* PATCH /api/users/:id  */
router.patch(
  '/:id',
  verifyToken,
  verifyOwnId,
  userController.updateUser
  )
  
/* GET /api/users?role=xxxx  */
router.get(
  '/',
  userController.getUsers
)

/* GET /api/users/:id  */

router.get(
  '/:id',
  verifyToken,
  verifyOwnIdOrRecruiter,
  userController.getUserByID
)

/* DELETE /api/users  */
router.delete(
  '/:id',
  verifyToken,
  verifyOwnId,
  userController.deleteUser
);


module.exports = router;