const User = require('../models/user'); // импортируем модель

/**
 * возвращает список пользователей из БД
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка сервера ${err}` }));
};

/**
 * возвращает конкретного пользователя из БД по его идентификатору, переданному в GET-запросе
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const getOneUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Нет пользователя с таким id' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.status >= 500) {
        return res.status(500).send({ message: `Произошла ошибка сервера ${err}` });
      }
      // если пользователя нет, то возвращаем статус 404 и json с сообщением
      return res.status(404).json({ message: 'Нет пользователя с таким id' });
    });
};

/**
 * создает пользователя в БД и возвращает его в качестве ответа
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const createUser = (req, res) => {
  const { name, avatar, about } = req.body;

  User.create({ name, avatar, about })
    // вернём записанные в базу данные
    .then((user) => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: `Произошла ошибка сервера ${err}` }));
};

/**
 * обновляет информацию о пользователе в БД и возвращает информацию о пользователе до замены
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Нет пользователя с таким id' });
      }
      return res.send(user);
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка сервера ${err}` }));
};

/**
 * обновляет аватар пользователя в БД и возвращает информацию о пользователе до замены
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Нет пользователя с таким id' });
      }
      return res.send(user);
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка сервера ${err}` }));
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  updateAvatar,
};
