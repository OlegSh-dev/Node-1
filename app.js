require('dotenv').config();

const express = require('express'); // подключаем фреймворк
const mongoose = require('mongoose'); // подключаем ODM для работы с MongoDB

const helmet = require('helmet'); // мидлвара для автоматической установки необходимых заголовков для безопасности
const bodyParser = require('body-parser'); // подключаем парсер для обработки тела запросов
const { celebrate, Joi, errors } = require('celebrate');

const app = express(); // создаем приложение

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { createUser, login } = require('./controllers/users');
const { getCards } = require('./controllers/cards');

const users = require('./routes/users'); // подключаем роутер
const cards = require('./routes/cards'); // подключаем роутер
const page404 = require('./routes/page404'); // подключаем роутер

// все запросы будут парситься из json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

// создаем коннект с БД
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger); // логгирование запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().regex(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), createUser);

// вынесли отдельно маршрут с получением всех карточек, чтобы он не был закрыт авторизацией
app.get('/cards', getCards);

app.use(auth);

app.use(users); // используем роутер для отработки адресов - users
app.use(cards); // используем роутер для отработки адресов - cards
app.use(page404); // используем роутер для отработки адресов - остальных

app.use(errorLogger); // логгирование ошибок

app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`Сервер запущен, слушается порт: ${PORT}`);
});
