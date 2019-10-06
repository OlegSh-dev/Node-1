const router = require('express').Router(); // создаем роутер

const { getUsers, getOneUser } = require('./users'); // подключаем функции-обработчики
const getCards = require('./cards');
const sendError = require('./pagenotfound');

// управлем выдачей при обращении к разным адресам
router.get('/users', getUsers);
router.get('/users/:id', getOneUser);

router.get('/cards', getCards);

router.get('*', sendError); // все прочие адреса

module.exports = router;
