const express = require('express'); // подключаем фреймворк
const mongoose = require('mongoose'); // подключаем ODM для работы с MongoDB
// const path = require('path');
const helmet = require('helmet'); // мидлвара для автоматической установки необходимых заголовков для безопасности

const bodyParser = require('body-parser'); // подключаем парсер для обработки тела запросов

const app = express(); // создаем приложение

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');

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

// при обращении к адресу сервера возвращаем статику из папки public
// app.use(express.static(path.join(__dirname, '/public')));

app.post('/signin', login);
app.post('/signup', createUser);

// вынесли отдельно маршрут с получением всех карточек, чтобы он не был закрыт авторизацией
app.get('/cards', getCards);

app.use(auth);

app.use(users); // используем роутер для отработки адресов - users
app.use(cards); // используем роутер для отработки адресов - cards
app.use(page404); // используем роутер для отработки адресов - остальных

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`Сервер запущен, слушается порт: ${PORT}`);
});
