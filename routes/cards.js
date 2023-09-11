const router = require('express').Router();
const { cardIdValidator, cardCreateValidator } = require('../middlewares/validators');

const {
  createCard,
  getCards,
  delCardId,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', cardIdValidator, delCardId);
router.post('/', cardCreateValidator, createCard);
router.put('/:cardId/likes', cardIdValidator, likeCard);
router.delete('/:cardId/likes', cardIdValidator, dislikeCard);

module.exports = router;
