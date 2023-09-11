const router = require('express').Router();
const { userIdValidator, avatarLinkValidator, userInfoValidator } = require('../middlewares/validators');

const {
  getUsers,
  getUserId,
  updateUserProfile,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', userIdValidator, getUserId);

router.patch('/me/avatar', avatarLinkValidator, updateUserAvatar);
router.patch('/me', userInfoValidator, updateUserProfile);

module.exports = router;
