/* eslint-disable no-else-return */
const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const RightsError = require('../errors/rights-err');

/**
 * возвращает из БД все карточки
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

/**
 * создает новую карточку в БД и возвращает информацию о ней
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch(next);
};

/**
 * удаляет карточку из БД и возвращает информацию о ней
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        // для случая, когда id валидный, но его нет в базе
        throw new NotFoundError('Нет карточки с таким id');
      } else if (card.owner.toString() !== req.user._id.toString()) {
        throw new RightsError('Недостаточно прав');
      } else {
        return Card.findByIdAndRemove(req.params.cardId)
          .then((deletedCard) => res.send(deletedCard))
          .catch(next);
      }
    })
    .catch(next);
};

/**
 * добавляет в массив с лайками у карточки id пользователя и возвращает информацию о карточке
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const makeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      return res.send(card);
    })
    .catch(next);
};

/**
 * убирает из массива с лайками id пользователя и возвращает информацию о карточке
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  makeLike,
  removeLike,
};
