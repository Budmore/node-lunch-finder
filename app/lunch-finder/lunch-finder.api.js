var placesToEat = require('../places-to-eat/places-to-eat.service');
var slackMessageService = require('../messages/slack-message.service');


module.exports = {

	random: function(req, res) {

		placesToEat.getRandomPlace().then(function(randomPlace) {

			var places = [];
			places.push(randomPlace);

			var message = slackMessageService.messageFormating(places);

			res.json(message);
		});

	}

};
