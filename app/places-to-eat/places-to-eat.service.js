var q = require('q');
var PlaceModel = require('./places-to-eat.model');

module.exports = {

	/**
	 * Get all places from db. Request is limited by maxLimit value
	 *
	 * Method: GET
	 * http://api.lunchfinder.budmore.pl/v1/places-to-eat/
	 *
	 * @param  {number} limit - Limit amount of records to get
	 * @return {array}
	 */
	getAll: function(limit) {
		var deffered = q.defer();

		PlaceModel
			.find({})
			.limit(limit)
			.exec(function(err, places) {
				if (err) {
					deffered.reject(err);
				}

				var _result = {
					count: places.length,
					data: places
				};

				deffered.resolve(_result);
			});

		return deffered.promise;
	}


};
