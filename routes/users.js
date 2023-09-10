const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUserId,
  updateUserProfile,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me/avatar', updateUserAvatar);
router.patch('/me', updateUserProfile);

module.exports = router;
