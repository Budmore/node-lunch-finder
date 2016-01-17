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

});
