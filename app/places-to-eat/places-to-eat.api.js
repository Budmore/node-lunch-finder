var PlaceModel = require('./places-to-eat.model');
var config = require('../../config');

var maxLimit = config.queryLimit || 100;


module.exports = {

	/**
	 * Get all places from db. Request is limited by maxLimit value
	 *
	 * Method: GET
	 * http://api.lunch-finder.budmore.pl/v1/places-to-eat/
	 *
	 * @param  {object} res Respond data
	 * @param  {object} req Request data
	 * @param  {number} req.query.limit Limit amount of places
	 * @return {array}
	 */
	getAll: function(req, res) {
		var queryLimit = req.query && Math.abs(req.query.limit);

		var limit = maxLimit;

		if (queryLimit) {
			limit = queryLimit > 0 ? Math.min(queryLimit, maxLimit) : maxLimit;
		}



		PlaceModel
			.find({})
			.limit(limit)
			.exec(function(err, places) {
				if (err) {
					return res.status(500).send(err);
				}

				var _result = {
					count: places.length,
					data: places
				};

				res.json(_result);
			});
	}


};
