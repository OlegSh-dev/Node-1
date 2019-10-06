const express = require('express'); // подключаем фреймворк
const path = require('path');

const app = express(); // создаем приложение

const { PORT = 3000 } = process.env;


const router = require('./routes/routes'); // подключаем роутер

app.use(express.static(path.join(__dirname, '/public'))); // при обращении к адресу сервера возвращаем статику из папки public

app.use(router); // используем роутер для отработки адресов

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`Сервер запущен, слушается порт: ${PORT}`);
});
