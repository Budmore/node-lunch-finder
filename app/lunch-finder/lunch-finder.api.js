var superagent = require('superagent');
var placesToEat = require('../places-to-eat/places-to-eat.service');
var slackMessageService = require('../messages/slack-message.service');
var scaperService = require('../scraper/scraper.service');

var availableCommands = [
	// 'help',
	'random',
	'zzTop'
];

function errorHandler(res, err) {
	return res.send(err);
}

var lunchFinderApi = {

	getRandomPlace: function(req, res) {
		placesToEat.getRandomPlace().then(function(randomPlace) {

			var places = [];
			places.push(randomPlace);

			var message = slackMessageService.messageFormating(places);
			res.json(message);

		}, errorHandler.bind(this, res));

	},

	scrapLunchMenu: function(req, res, name) {

		var respondMessage = {
			'response_type': 'in_channel',
			'text': ''
		};

		scaperService.getPictureFromFacebookPost(name).then(function(data) {

			respondMessage.text = data;
			res.json(respondMessage);

		}, errorHandler.bind(this, res));
	},

	command: function(req, res) {

		var text = req.body.text && req.body.text.toString();
		text = text && text.toLowerCase().trim();
		var message = 'Available commands: "' + availableCommands.join('", "') + '"';

		switch (text) {

			case '!random':
			case 'random':
			case 'rng':
				lunchFinderApi.getRandomPlace(req, res);
				break;

			case 'zz':
			case 'zztop':
			case 'zupa':
				lunchFinderApi.scrapLunchMenu(req, res, 'zztopwroclaw');
				break;

/*
			case '!help':
			case 'help':
			case 'h':
				message = lunchFinderApi.getHelpMessage();
				break;
*/

			default:
				res.send(message);
				break;
		}

	}

};

module.exports = lunchFinderApi;
