var lunchFinderService = require('./lunch-finder.service');



module.exports = {

	random: function(req, res) {
		// @TODO create init function or emit some event?
		lunchFinderService.generateRaitingList().then(function() {
			var places = lunchFinderService.getRandomPlaces();
			res.json(places);

		}, function() {
			res.status(200).send('Sorry, no results');
		});

	}

};
