const users = require('express').Router(); // создаем роутер

const { celebrate, Joi } = require('celebrate');

// подключаем функции-обработчики
const {
  getUsers,
  getOneUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// управлем выдачей при обращении к разным адресам
users.get('/users', getUsers);

users.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().alphanum(),
  }),
}), getOneUser);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

users.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/),
  }),
}), updateAvatar);

module.exports = users;
