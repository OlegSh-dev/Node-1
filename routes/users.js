const users = require('../data/users.json'); // импортируем данные о пользователях из json-файла

/**
 * возвращает json со списком пользователей
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const getUsers = (req, res) => {
  res.send(users);
};

/**
 * возвращает json-объект конкретного пользователя по его идентификатору, переданного в GET-запросе
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const getOneUser = (req, res) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const user of users) {
    // eslint-disable-next-line no-underscore-dangle
    if (req.params.id === user._id) {
      res.send(user);
      return;
    }
  }

  // если пользователя нет, то возвращаем статус 404 и json-объект с сообщением
  res.status(404).json({ message: 'Нет пользователя с таким id' });
};

module.exports = { getUsers, getOneUser };
