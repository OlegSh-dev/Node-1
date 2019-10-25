const Card = require('../models/card');

/**
 * возвращает из БД все карточки
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка сервера ${err}` }));
};

/**
 * создает новую карточку в БД и возвращает информацию о ней
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка сервера ${err}` }));
};

/**
 * удаляет карточку из БД и возвращает информацию о ней
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.status >= 500) {
        return res.status(500).send({ message: `Произошла ошибка сервера ${err}` });
      }
      // если такой карточки нет, то возвращаем статус 404 и json-объект с сообщением
      return res.status(404).json({ message: 'Нет карточки с таким id' });
    });
};

/**
 * добавляет в массив с лайками у карточки id пользователя и возвращает информацию о карточке
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const makeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка сервера ${err}` }));
};

/**
 * убирает из массива с лайками id пользователя и возвращает информацию о карточке
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка сервера ${err}` }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  makeLike,
  removeLike,
};
