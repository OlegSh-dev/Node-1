/**
 * возвращает статус 404 и json с сообщением
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const sendError = (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
};

module.exports = sendError;
