const router = require('express').Router();
const { validateUpdateUser, validateUserAvatar, validateId } = require('../middlewares/validators');
const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getAuthUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getAuthUser);
router.get('/:id', validateId, getUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = router;
