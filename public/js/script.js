'use strict';

const api = new Api({
	baseUrl: 'http://95.216.175.5/cohort2',
	headers: {
		authorization: '7858cecb-8a25-4aa6-9e6c-4b58c7960d56',
		contentType: 'application/json'
	}
});

const user = new User();

const placesListEl = new CardList(document.querySelector('.places-list'));

document.querySelector('.sort-button').addEventListener('click', function() {
	document.querySelector('.sort-button').classList.toggle('pressed');
	document.querySelector('.sort-button').blur();
	placesListEl.sortCards();
});

document.querySelector('.user-info__button').addEventListener('click', function(event) {
	const form = new Form(event);
});

document.querySelector('.user-info__edit-button').addEventListener('click', function(event) {
	const form = new Form(event);
});

document.querySelector('.user-info__photo').addEventListener('click', function(event) {
	const form = new Form(event);
});