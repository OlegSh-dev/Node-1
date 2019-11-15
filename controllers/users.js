const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/not-found-err');

const User = require('../models/user'); // импортируем модель

/**
 * возвращает список пользователей из БД
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

/**
 * возвращает конкретного пользователя из БД по его идентификатору, переданному в GET-запросе
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const getOneUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.send(user);
    })
    .catch(next);
};

/**
 * создает пользователя в БД и возвращает его в качестве ответа
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const createUser = (req, res, next) => {
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
    .catch(next);
};

/**
 * обновляет информацию о пользователе в БД и возвращает информацию о пользователе до замены
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.send(user);
    })
    .catch(next);
};

/**
 * обновляет аватар пользователя в БД и возвращает информацию о пользователе до замены
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.send(user);
    })
    .catch(next);
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
