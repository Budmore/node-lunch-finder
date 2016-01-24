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
	},

	/**
	 * Create new place
	 *
	 * Method: POST
	 * http://api.lunchfinder.budmore.pl/v1/places-to-eat/
	 *
	 * @param  {object} newPlace
	 * @return {object} 		Promise
	 */
	create: function(newPlace) {
		var dfd = q.defer();
		var createPlace = new PlaceModel(newPlace);

		createPlace.save(function(err, doc) {
			if (err) {
				return dfd.reject(err);
			}

			return dfd.resolve(doc);
		});

		return dfd.promise;
	},

	/**
	 * Seperate loaction property as new object and generate mapUrl
	 *
	 * @param  {Object} location
	 * @param  {String} location.address
	 * @param  {String} location.country
	 * @param  {String} location.city
	 * @return {Object}
	 */
	newLocation: function(location) {
		var newLocation = {};
		var query = 'http://maps.google.com/?q=';

		if (location && location.address) {

			var address = location.address || '';
			var country = location.country || '';
			var city = location.city || '';

			var mapUrl = `${query}${address}+${city}+${country}`;

			newLocation = {
				address,
				country,
				city,
				mapUrl
			};
		}


		return newLocation;
	}
};
