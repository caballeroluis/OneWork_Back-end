const express = require('express');

const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyAuth.middleware');
const { verifyOwnId, verifyOwnIdOrRecruiter } = require('../middlewares/verifyRole.middleware');
const { userValidator } = require('../middlewares/validators.middleware');

const router = express.Router();

/* POST /api/users  */
router.post(
	'/',
	userValidator,
  userController.createUser
);

/* PATCH /api/users/:id  */
router.patch(
  '/:id',
  verifyToken,
  verifyOwnId,
  userValidator,
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
  // verifyToken,
  // verifyOwnIdOrRecruiter, // Todo: rollback front 4388e83dfe9fdc4d067f0a959be214f25f803783
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