var placesToEatService = require('./places-to-eat.service');
var PlaceModel = require('./places-to-eat.model');
var config = require('../../config');

var maxLimit = config.queryLimit || 100;
var defaultRating = config.defaultRating || 1000;

module.exports = {

	/**
	 * Get all places from db. Request is limited by maxLimit value
	 *
	 * Method: GET
	 * http://api.lunchfinder.budmore.pl/v1/places-to-eat/
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

		placesToEatService.getAll(limit).then(
			function getAllSuccess(data) {
				res.json(data);
			},
			function getAllError(reason) {
				return res.status(500).send(reason);
			}
		);
	},

	/**
	 * Create new place
	 *
	 * Method: POST
	 * http://api.lunchfinder.budmore.pl/v1/places-to-eat/
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 */
	create: function(req, res) {
		var newPlace = {
			name: req.body.name,
			description: req.body.description,
			websiteUrl: req.body.websiteUrl,
			tags: req.body.tags,
			menuPrice: req.body.menuPrice,
			lunchPrice: req.body.lunchPrice,
			location: {}
		};

		var location = req.body.location;
		if (location) {
			newPlace.location = placesToEatService.newLocation(location);
		}

		placesToEatService.create(newPlace).then(
			function saveSuccess(data) {
				res.status(201).send(data);
			},
			function saveError(err) {
				// @TODO create generic error handler.
				if (err && err.name === 'ValidationError') {
					return res.status(400).send(err);
				}

				return res.status(500).send(err);
			}
		);

	},

	/**
	 * Get place by id.
	 *
	 * Method: GET
	 * http://api.lunchfinder.budmore.pl/v1/places-to-eat/:id
	 *
	 * @param  {object} req Request data
	 * @param  {object} req.id Place id
	 * @param  {object} res Respond data
	 * @return {object}
	 */
	getById: function(req, res) {

		var query = {
			_id: req.params.id
		};

		PlaceModel.findOne(query, function(err, doc) {
			if (err) {
				return res.status(404).send(err);
			}

			res.send(doc);
		});
	},


	/**
	 * Update place. Find it by id in the request param.
	 * Can't update properties:  _id, modified
	 *
	 * Method: PUT
	 * http://api.lunchfinder.budmore.pl/v1/places-to-eat/:id
	 *
	 * @param  {object} res Respond data
	 * @param  {object} req Request data
	 * @return {object}
	 */
	updateById: function(req, res) {

		var query = {
			_id: req.params.id
		};

		var updatedPlace = req.body;
		delete updatedPlace._id;
		updatedPlace.modified = new Date();

		PlaceModel.findOneAndUpdate(query, {
			$set: updatedPlace
		}, {
			new: true
		}, function(err, doc) {
			// @TODO create generic error handler.
			if (err) {
				if (err.name === 'CastError') {
					return res.status(404).send(err);

				}
				return res.status(500).send(err);
			}

			res.send(doc);

		});
	},

	/**
	 * Delete the place. Find it by id in the request params
	 *
	 * Method: DELETE
	 * http://api.lunchfinder.budmore.pl/v1/places-to-eat/:id
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {object}
	 */
	deleteById: function(req, res) {

		var query = {
			_id: req.params.id
		};

		PlaceModel.findOneAndRemove(query, function(err) {
			// @TODO create generic error handler.
			if (err) {
				if (err.name === 'CastError') {
					return res.status(404).send(err);

				}
				return res.status(500).send(err);
			}

			res.status(204).send('Resource deleted successfully');
		});
	}
};
