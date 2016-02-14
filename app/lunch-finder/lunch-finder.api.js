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

	scrapLunchMenu: function(responseUrl, name) {

		var respondMessage = {
			'response_type': 'in_channel',
			'text': ''
		};

		scaperService.scrapFacebookPosts(name).then(function(data) {
			respondMessage.text = data;
			superagent
				.post(responseUrl)
				.send(respondMessage)
				.end(function(err, response) {
					if (err) {
						console.error(err);
					}

					console.log('response', response && response.text);
				});
		});
	},

	command: function(req, res) {

		var responseUrl = req.body.response_url;
		var command = req.body.text.toLowerCase();
		command = command.trim();

		console.log('Mhmmm', responseUrl);

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
				lunchFinderApi.scrapLunchMenu(responseUrl, 'zztop');
				res.json('Got it.');
				break;

			// case '!help':
			// case 'help':
			// case 'h':
			//     var message = lunchFinderApi.getHelpMessage();


			default:
				res.json(message);
				break;
		}

	}

};

module.exports = lunchFinderApi;
