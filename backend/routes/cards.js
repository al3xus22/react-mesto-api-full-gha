const router = require('express').Router();
const { validateCardInfo, validateCardId } = require('../middlewares/validators');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', validateCardInfo, createCard);
router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
