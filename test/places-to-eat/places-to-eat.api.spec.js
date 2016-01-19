var assert = require('chai').assert;
var request = require('superagent');

var app = require('../../app');
var config = require('../../config');
var port = config.port;
var version = config.version;
var baseUrl = 'http://localhost:' + port + version;
var PlaceModel = require('../../app/places-to-eat/places-to-eat.model');



describe('places-to-eat.api.js', function() {

	before(function(done) {
		app.startServer(port, done);
	});

	after(function(done) {
		app.stopServer(done);
	});


	// getAll()


	describe('getAll()', function() {

		beforeEach('Insert 150x records to the db', function(done) {
			var mockedPlace = {
				name: 'Bar foo&boo ',
				description: ''
			};
			var placesList = [];

			for ( var i=0; i<150; i+=1) {
				mockedPlace.name += i;
				placesList.push(mockedPlace);
			}

			PlaceModel.create(placesList, function(err) {
				assert.isNull(err);
				done();
			});
		});

		it('should getAll() - 1 - no limit param', function(done) {
			request
				.get(baseUrl + '/places-to-eat')
				.end(function(err, res) {
					assert.isNull(err);
					assert.isArray(res.body.data);
					assert.equal(res.status, 200);
					assert.equal(res.body.count, config.queryLimit);

					done();
				});
		});

		it('should getAll() - 2 - query with limit ', function(done) {
			request
				.get(baseUrl + '/places-to-eat')
				.query({
					limit: 1
				})
				.end(function(err, res) {
					assert.equal(res.body.count, 1);
					done();
				});
		});

		it('should getAll() - 3 - query with negative number', function(done) {
			request
				.get(baseUrl + '/places-to-eat')
				.query({
					limit: -100
				})
				.end(function(err, res) {
					assert.equal(res.body.count, config.queryLimit);
					done();
				});
		});

		it('should getAll() - 4 - query with number 0', function(done) {
			request
				.get(baseUrl + '/places-to-eat')
				.query({
					limit: 0
				})
				.end(function(err, res) {
					assert.equal(res.body.count, config.queryLimit);
					done();
				});
		});

		it('should getAll() - 5 - query without natural number', function(done) {
			request
				.get(baseUrl + '/places-to-eat')
				.query({
					limit: 1.25
				})
				.end(function(err, res) {
					assert.equal(res.body.count, 1);
					done();
				});
		});
	});


	// create()


	describe('create()', function() {

		it('should create() - 1 - add new place', function(done) {

			var bodyRequest = {
				name: 'Bar Foo',
				tags: [{
					type: 'yolo',
					name: 'yolo'
				}]
			};

			request
				.post(baseUrl + '/places-to-eat')
				.send(bodyRequest)
				.end(function(err, res) {
					assert.isNull(err);
					assert.isObject(res.body);
					assert.equal(res.status, 201);

					done();
				});

		});

		it('should create() - 2 - bad request', function(done) {

			var bodyRequest = {
				description: 'lorem ipsum'
			};

			request
				.post(baseUrl + '/places-to-eat')
				.send(bodyRequest)
				.end(function(err, res) {
					assert.isNotNull(err);
					assert.isObject(res.body);
					assert.equal(res.status, 400);

					done();
				});

		});
	});


	// getById()


	describe('getById()', function() {
		var mockedPlace = {
			_id: '55166e70fb1e9a18818ad8fd',
			name: 'Bar Foo'
		};

		beforeEach('Create model with id (to test on it)',function(done) {

			var createPlace = new PlaceModel(mockedPlace);

			createPlace.save(function(err) {
				assert.isNull(err);
				done();
			});

		});

		it('should getById() - 1 - record exists', function(done) {

			request
				.get(baseUrl + '/places-to-eat/' + mockedPlace._id)
				.end(function(err, res) {
					assert.isNull(err);
					assert.isObject(res);
					assert.equal(res.body._id, mockedPlace._id);
					assert.equal(res.body.name, mockedPlace.name);
					assert.equal(res.status, 200);
					done();
				});

		});

		it('should getById() - 2 - record does not exists', function(done) {

			request
				.get(baseUrl + '/places-to-eat/fake-id')
				.end(function(err, res) {
					assert.isDefined(err);
					assert.isObject(res);
					assert.equal(res.status, 404);
					done();
				});
		});
	});


	// updateById()


	describe('updateById()', function() {
		var mockedPlace = {
			_id: '55166e7afb1e9a18818a1337',
			name: 'Foo Bar'
		};

		beforeEach('Create model with id (to test on it)',function(done) {

			var createPlace = new PlaceModel(mockedPlace);

			createPlace.save(function(err) {
				assert.isNull(err);
				done();
			});

		});

		it('should updateById() - 1 - update existing place', function(done) {
			var updatedPlace = {
				_id: '55166e7afb1e9a18818a1337',
				name: 'Yoko ono'
			};

			request
				.put(baseUrl + '/places-to-eat/' + updatedPlace._id)
				.send(updatedPlace)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 200);

					assert.equal(res.body._id, updatedPlace._id);
					assert.equal(res.body.name, updatedPlace.name);
					done();
				});
		});

		it('should updateById() - 2 - can\'t update raiting', function(done) {
			var updatedPlace = {
				_id: '55166e7afb1e9a18818a1337',
				raiting: 2000
			};

			request
				.put(baseUrl + '/places-to-eat/' + updatedPlace._id)
				.send(updatedPlace)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 200);

					assert.equal(res.body._id, updatedPlace._id);
					assert.notEqual(res.body.raiting, updatedPlace.raiting);
					done();
				});
		});

		it('should updateById() - 3 - place does not exists', function(done) {
			var updatedPlace = {
				_id: 'fake-id',
				raiting: 2000
			};

			request
				.put(baseUrl + '/places-to-eat/' + updatedPlace._id)
				.send(updatedPlace)
				.end(function(err, res) {
					assert.isDefined(err);
					assert.equal(res.status, 404);

					done();
				});
		});
	});


	// deleteById()


	describe('deleteById()', function() {
		var mockedPlace = {
			_id: '55166e7afb1e9a18818a1337',
			name: 'Foo Bar'
		};

		beforeEach('Create model with id (to test on it)',function(done) {

			var createPlace = new PlaceModel(mockedPlace);

			createPlace.save(function(err) {
				assert.isNull(err);
				done();
			});

		});


		it('should deleteById() - remove existing place', function(done) {
			var countBefore, countAfter;

			// Count documents before
			PlaceModel.count({}, function(err, count) {
				countBefore = count;
			});

			// Delete Request
			request
				.del(baseUrl + '/places-to-eat/' + mockedPlace._id)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 204);

					// Count documents after DELETE
					PlaceModel.count({}, function(err, count) {
						countAfter = count;

						assert.equal(countAfter, countBefore -1);
						done();
					});
				});
		});

		it('should deleteById() - 2 - place does not exists', function(done) {
			var updatedPlace = {
				_id: 'fake-id'
			};

			request
				.del(baseUrl + '/places-to-eat/' + updatedPlace._id)
				.send(updatedPlace)
				.end(function(err, res) {
					assert.isDefined(err);
					assert.equal(res.status, 404);

					done();
				});
		});

	});

});
