var q                  = require('q');
var listUtils          = require('../utils/list-utils');
var placesToEatService = require('../places-to-eat/places-to-eat.service');

var ratingList = [];

var service = {

	/**
	 * Generate new rating list.
	 */
	generateRatingList: function() {
		var dfd = q.defer();

		placesToEatService.getAll().then(
			function getAllSuccess(list) {
				if (!list || !list.data) {
					dfd.reject(list);
					return;
				}

				var newList = listUtils.getListByRating(list.data);

				if (newList) {
					ratingList = newList;
				}

				dfd.resolve();
			},
			function getAllError(reason) {
				// @TODO create error handler
				dfd.reject(reason);
			}
		);

		return dfd.promise;
	},

	/**
	 * Get array with random places to eat.
	 *
	 * @param  {number} counter - How many places
	 * @return {array}
	 */
	getRandomPlaces: function(counter) {

		var results = listUtils.getListWithRandomItems(ratingList, counter);

		return results;
	}

};

// @TODO: create event to regenerate rating list
service.generateRatingList();

/**
 * Create new rating list if recive event that some record has been updated.
 */
/*var emitter = new EventEmitter();
emitter.on('LIST_UPDATED', function() {
	service.generateRatingList();
});
*/

module.exports = service;
