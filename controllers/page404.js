const NotFoundError = require('../errors/not-found-err');

/**
 * возвращает статус 404 и json с сообщением
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const sendError = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};

module.exports = sendError;
