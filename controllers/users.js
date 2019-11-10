const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  const {
    name,
    avatar,
    about,
    email,
    password,
  } = req.body;

  if (password.trim().length < 5) {
    return res.status(500).send({ message: 'Длина пароля меньше 5 символов' });
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      avatar,
      about,
      email,
      password: hash,
    }))
    // вернём записанные в базу данные без хэша
    .then((user) => {
      const userEdited = { ...user._doc };
      delete userEdited.password;
      return res.send({ data: userEdited });
    })
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


const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
