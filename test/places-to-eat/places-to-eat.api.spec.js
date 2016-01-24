var q = require('q');
var sinon = require('sinon');
var assert = require('chai').assert;
var request = require('superagent');

var app = require('../../app');
var config = require('../../config');
var port = config.port;
var version = config.version;
var baseUrl = 'http://localhost:' + port + version;
var PlaceModel = require('../../app/places-to-eat/places-to-eat.model');
var placesToEatService = require('../../app/places-to-eat/places-to-eat.service');




describe('places-to-eat.api.js', function() {

	before(function(done) {
		app.startServer(port, done);
	});

	after(function(done) {
		app.stopServer(done);
	});


	// getAll()


	describe('getAll()', function() {
		var stub;

		beforeEach(function() {
			stub = sinon.stub(placesToEatService, 'getAll');
		});

		afterEach(function() {
			stub.restore();
		});

		it('should getAll() - 1 - no limit param', function(done) {
			var dfd = q.defer();
			stub.returns(dfd.promise);

			dfd.resolve();

			request
				.get(baseUrl + '/places-to-eat')
				.end(function() {
					assert.isTrue(stub.calledWithMatch(config.queryLimit));
					done();
				});
		});

		it('should getAll() - 2 - query with limit ', function(done) {
			var dfd = q.defer();
			stub.returns(dfd.promise);

			dfd.resolve();


			var mockedLimit = 1;
			request
				.get(baseUrl + '/places-to-eat')
				.query({
					limit: mockedLimit
				})
				.end(function() {
					assert.isTrue(stub.calledWithMatch(mockedLimit));
					done();
				});
		});

		it('should getAll() - 3 - query with negative number', function(done) {
			var dfd = q.defer();
			stub.returns(dfd.promise);

			dfd.resolve();

			var mockedLimit = -100;
			request
				.get(baseUrl + '/places-to-eat')
				.query({
					limit: mockedLimit
				})
				.end(function() {
					assert.isTrue(stub.calledWithMatch(-mockedLimit));
					done();
				});
		});

		it('should getAll() - 4 - rejected request', function(done) {
			var dfd = q.defer();
			stub.returns(dfd.promise);

			dfd.reject();

			request
				.get(baseUrl + '/places-to-eat')
				.end(function(err, res) {
					assert.equal(res.status, 500);
					done();
				});
		});
	});


	// create()


	describe('create()', function() {
		var stub;

		beforeEach(function() {
			stub = sinon.stub(placesToEatService, 'create');
		});

		afterEach(function() {
			stub.restore();
		});

		it('should create() - 1 - add new place', function(done) {
			var dfd = q.defer();
			stub.returns(dfd.promise);

			var mockedResponse = { foo: 'boo' };
			dfd.resolve(mockedResponse);

			var bodyRequest = {
				name: 'Bar Foo'
			};

			request
				.post(baseUrl + '/places-to-eat')
				.send(bodyRequest)
				.end(function(err, res) {
					assert.equal(res.status, 201);
					assert.deepEqual(res.body, mockedResponse);
					done();
				});

		});

		it('should create() - 2 - new location', function(done) {
			var stub2 = sinon.stub(placesToEatService, 'newLocation');

			var dfd = q.defer();
			stub.returns(dfd.promise);
			dfd.reject();

			var bodyRequest = {
				name: 'Foo Boo',
				location: {}
			};

			request
				.post(baseUrl + '/places-to-eat')
				.send(bodyRequest)
				.end(function() {

					assert.isTrue(stub2.called);
					stub2.restore();
					done();
				});
		});

		it('should create() - 3 - reject handler error 400', function(done) {
			var stub2 = sinon.stub(placesToEatService, 'newLocation');

			var dfd = q.defer();
			stub.returns(dfd.promise);

			var mockedResponse = { name: 'ValidationError' };
			dfd.reject(mockedResponse);


			var bodyRequest = {
				name: 'Foo Boo'
			};

			request
				.post(baseUrl + '/places-to-eat')
				.send(bodyRequest)
				.end(function(err, res) {
					assert.equal(res.status, 400);

					assert.isFalse(stub2.called);
					stub2.restore();

					done();
				});
		});

		it('should create() - 4 - reject handler error 500', function(done) {
			var stub2 = sinon.stub(placesToEatService, 'newLocation');

			var dfd = q.defer();
			stub.returns(dfd.promise);

			dfd.reject();


			var bodyRequest = {
				name: 'Foo Boo'
			};

			request
				.post(baseUrl + '/places-to-eat')
				.send(bodyRequest)
				.end(function(err, res) {
					assert.equal(res.status, 500);
					assert.isFalse(stub2.called);
					stub2.restore();

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

		it('should updateById() - 2 - can\'t update rating', function(done) {
			var updatedPlace = {
				_id: '55166e7afb1e9a18818a1337',
				rating: 2000
			};

			request
				.put(baseUrl + '/places-to-eat/' + updatedPlace._id)
				.send(updatedPlace)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 200);

					assert.equal(res.body._id, updatedPlace._id);
					assert.notEqual(res.body.rating, updatedPlace.rating);
					done();
				});
		});

		it('should updateById() - 3 - place does not exists', function(done) {
			var updatedPlace = {
				_id: 'fake-id',
				rating: 2000
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
