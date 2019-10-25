const express = require('express'); // подключаем фреймворк
const mongoose = require('mongoose'); // подключаем ODM для работы с MongoDB
// const path = require('path');
const bodyParser = require('body-parser'); // подключаем парсер для обработки тела запросов

const app = express(); // создаем приложение

const { PORT = 3000 } = process.env;

const users = require('./routes/users'); // подключаем роутер
const cards = require('./routes/cards'); // подключаем роутер
const page404 = require('./routes/page404'); // подключаем роутер

// временная эмуляция авторизированного пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '5db2e31e2c1e683c7431d0e4',
  };

  next();
});

// все запросы будут парситься из json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// создаем коннект с БД
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// при обращении к адресу сервера возвращаем статику из папки public
// app.use(express.static(path.join(__dirname, '/public')));

app.use(users); // используем роутер для отработки адресов - users
app.use(cards); // используем роутер для отработки адресов - cards
app.use(page404); // используем роутер для отработки адресов - остальных

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`Сервер запущен, слушается порт: ${PORT}`);
});
