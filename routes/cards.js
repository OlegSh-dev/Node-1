const cards = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  makeLike,
  removeLike,
} = require('../controllers/cards');


cards.get('/cards', getCards);
cards.post('/cards', createCard);
cards.delete('/cards/:cardId', deleteCard);
cards.put('/cards/:cardId/likes', makeLike);
cards.delete('/cards/:cardId/likes', removeLike);

module.exports = cards;
