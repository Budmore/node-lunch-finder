var q = require('q');
var listUtils = require('../utils/list-utils');
var placesToEatService = require('../places-to-eat/places-to-eat.service');

var raitingList = [];

module.exports = {

	/**
	 * Generate new raiting list.
	 */
	generateRaitingList: function() {
		var dfd = q.defer();

		placesToEatService.getAll().then(
			function getAllSuccess(list) {
				if (!list || !list.data) {
					dfd.reject(list);
					return;
				}

				var newList = listUtils.getListByRating(list.data);

				if (newList) {
					raitingList = newList;
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

		var results = listUtils.getListWithRandomItems(raitingList, counter);

		return results;
	}

};


/**
 * Create new raiting list if recive event that some record has been updated.
 */
// @TODO: create event to regenerate raiting list
/*var emitter = new EventEmitter();
emitter.on('LIST_UPDATED', function() {
	console.log('aaaaaaaaa');
	service.generateRaitingList();
});
*/
