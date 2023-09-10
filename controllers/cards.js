const Card = require('../models/card');
const { CREATED_CODE } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user });
    return res.status(CREATED_CODE).send(card);
  } catch (err) {
    return next(err);
  }
};

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

module.exports.delCardId = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findOne({ _id: cardId });
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    if (String(card.owner) !== req.user._id) {
      throw new ForbiddenError('Нет прав для выполнения действия');
    }
    await Card.deleteOne(card);
    return res.send(card);
  } catch (err) {
    return next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    return res.send(card);
  } catch (err) {
    return next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    return res.send(card);
  } catch (err) {
    return next(err);
  }
};
