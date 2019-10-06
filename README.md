# Node-1
[![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/olegsh-dev/Node-1?label=version)](https://github.com/OlegSh-dev/Node-1/releases/)
### Учебный проект по созданию сервера на Node.js с использованием фреймворка Express.js.
  
#### Цель
Создание сервера на Node.js для сервиса Mesto по размещению фотокарточек с красивыми местами нашей планеты.

#### Функциональность API
1. GET-запрос на адрес localhost:3000 загружает фронтенд сервиса Mesto;
2. GET-запрос на адрес localhost:3000/users вернёт JSON-объект из файла users.json;
3. GET-запрос на адрес localhost:3000/cards вернёт JSON-объект из файла cards.json;
4. GET-запрос на адрес localhost:3000/users/8340d0ec33270a25f2413b69 вернёт JSON-объект пользователя с переданным после /users идентификатором;
5. Если пользователя с запрошенным идентификатором нет, API вернёт 404 статус ответа и JSON: { "message": "Нет пользователя с таким id" };
6. При запросе на несуществующий адрес, API вернёт 404 статус ответа и JSON: { "message": "Запрашиваемый ресурс не найден" }.

#### Установка и запуск проекта
1. Скачать сборку архивом или используя команду:  
```git clone git@github.com:OlegSh-dev/Node-1.git```  
2. Запустить установку зависимостей через терминал:  
```npm i```  
3. Выбрать необходимый вариант запуска:  
```
# production - запуск сервера  
npm run start
# develop - запуск сервера с hot reload  
npm run dev
```
