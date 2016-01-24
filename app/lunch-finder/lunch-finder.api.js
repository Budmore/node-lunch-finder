var lunchFinderService = require('./lunch-finder.service');
var slackMessageService = require('../messages/slack-message.service');


module.exports = {

	random: function(req, res) {
		var places = lunchFinderService.getRandomPlaces();
		var message = slackMessageService.messageFormating(places);

		res.json(message);
	}

};
