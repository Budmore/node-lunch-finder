var placesToEatService = require('../places-to-eat/places-to-eat.service');
var listUtils = require('../utils/list-utils');
var q = require('q');
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
	}


};
