var assert = require('chai').assert;
var PlaceToEatService = require('../../app/places-to-eat/places-to-eat.service');
var PlaceModel = require('../../app/places-to-eat/places-to-eat.model');




describe('places-to-eat.service.js', function() {

	// getAll()


	describe('getAll()', function() {
		var mockedCounter = 5;

		beforeEach('Insert 150x records to the db', function(done) {
			var mockedPlace = {
				name: 'Bar foo&boo ',
				description: ''
			};
			var placesList = [];

			for ( var i=0; i<mockedCounter; i+=1) {
				placesList.push(mockedPlace);
			}

			PlaceModel.create(placesList, function(err) {
				assert.isNull(err);
				done();
			});
		});

		it('should getAll() - 1 - no limit param', function(done) {

			PlaceToEatService.getAll().then(function(data) {
				assert.equal(data.count, mockedCounter);
				done();
			});

		});

		it('should getAll() - 2 - with limit', function(done) {
			var limit = 2;

			PlaceToEatService.getAll(limit).then(function(data) {
				assert.equal(data.count, limit);
				done();
			});
		});
	});


	// create()

	it('should create() - no argument', function(done) {

		PlaceToEatService.create().catch(function(error) {
			assert.isDefined(error);
			done();
		});

	});

	it('should create() - correct argument ', function(done) {
		var mocked = {
			name: 'Foo'
		};

		PlaceToEatService.create(mocked).then(function(data){
			assert.equal(data.name, mocked.name);
			done();
		});

	});


	// newLocation()

	it('should newLocation() - 1 - no arguments', function() {
		var newLocation = PlaceToEatService.newLocation();

		assert.isObject(newLocation);
		assert.isUndefined(newLocation.address);
	});

	it('should newLocation() - 2 - incorrect arguments', function() {
		var newLocation = PlaceToEatService.newLocation('foo');

		assert.isObject(newLocation);
		assert.isUndefined(newLocation.address);
	});

	it('should newLocation() - 3 - have address', function() {
		var mocked = {
			address: 'foo'
		};

		var newLocation = PlaceToEatService.newLocation(mocked);

		assert.equal(newLocation.address, mocked.address);
	});

	it('should newLocation() - 4 - have mapUrl', function() {
		var mocked = {
			address: 'foo'
		};

		var newLocation = PlaceToEatService.newLocation(mocked);
		assert.equal(newLocation.address, mocked.address);
	});

});
