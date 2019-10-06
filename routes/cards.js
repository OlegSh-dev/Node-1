const cards = require('../data/cards'); // импортируем данные о карточках из json-файла

/**
 * возвращает json со списком карточек
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const getCards = (req, res) => {
  res.send(cards);
};

module.exports = getCards;
