const page404 = require('express').Router();

const sendError = require('../controllers/page404');

page404.get('*', sendError); // все прочие адреса

module.exports = page404;
