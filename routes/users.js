const users = require('express').Router(); // создаем роутер

// подключаем функции-обработчики
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// управлем выдачей при обращении к разным адресам
users.get('/users', getUsers);
users.get('/users/:id', getOneUser);
users.post('/users', createUser);
users.patch('/users/me', updateUser);
users.patch('/users/me/avatar', updateAvatar);

module.exports = users;
