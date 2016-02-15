var superagent = require('superagent');
var placesToEat = require('../places-to-eat/places-to-eat.service');
var slackMessageService = require('../messages/slack-message.service');
var scaperService = require('../scraper/scraper.service');

var availableCommands = [
	// 'help',
	'random',
	'zzTop'
];

var lunchFinderApi = {

	getRandomPlace: function(req, res) {
		placesToEat.getRandomPlace().then(function(randomPlace) {

			var places = [];
			places.push(randomPlace);

			var message = slackMessageService.messageFormating(places);

			res.json(message);
		});

	},

	scrapLunchMenu: function(responseUrl, name, res) {

		var respondMessage = {
			'response_type': 'in_channel',
			'text': ''
		};

		scaperService.scrapFacebookPosts(name).then(function(data) {
			respondMessage.text = data;
			res.json(data);
		});
	},

	command: function(req, res) {

		var responseUrl = req.body.response_url;
		var command = req.body.text.toLowerCase();
		command = command.trim();

		var message = 'Available commands: "' + availableCommands.join('", "') + '"';

		switch (command) {

			case '!random':
			case 'random':
			case 'rng':
				lunchFinderApi.getRandomPlace(req, res);
				break;

			case 'zz':
			case 'zztop':
			case 'zupa':
				lunchFinderApi.scrapLunchMenu(responseUrl, 'zztop', res);
				break;

			// case '!help':
			// case 'help':
			// case 'h':
			//     var message = lunchFinderApi.getHelpMessage();


			default:
				res.send(message);
				break;
		}

	}

};

module.exports = lunchFinderApi;
