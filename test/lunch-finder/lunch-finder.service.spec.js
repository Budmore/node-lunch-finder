var q = require('q');
var sinon = require('sinon');
var assert = require('chai').assert;
var lunchFinderService = require('../../app/lunch-finder/lunch-finder.service');
var placesToEatService = require('../../app/places-to-eat/places-to-eat.service');
var listUtils = require('../../app/utils/list-utils');


describe('lunch-finder.service.js', function() {

	var mockedList = {
		data: [
			{ name: 'foo', raiting: 2},
			{ name: 'bar', raiting: 3},
		]
	};
	var stub;

	beforeEach(function() {
		stub = sinon.stub(placesToEatService, 'getAll');
	});

	afterEach(function() {
		stub.restore();
	});

	it('should generateRaitingList() - 1 - resolve (success)', function(done) {
		var dfd = q.defer();
		var successCb = sinon.spy();
		var errorCb = sinon.spy();

		stub.returns(dfd.promise);

		lunchFinderService.generateRaitingList()
			.then(successCb, errorCb)
			.done(function() {
				assert.isTrue(successCb.called);
				assert.isFalse(errorCb.called);
				done();
			});

		dfd.resolve(mockedList);


	});

	it('should generateRaitingList() - 2 - reject (error)', function(done) {
		var dfd = q.defer();
		var successCb = sinon.spy();
		var errorCb = sinon.spy();

		stub.returns(dfd.promise);

		lunchFinderService.generateRaitingList()
			.then(successCb, errorCb)
			.done(function() {
				assert.isFalse(successCb.called);
				assert.isTrue(errorCb.called);
				done();
			});

		dfd.reject();
	});


	it('should generateRaitingList() - 3 - getAll return undefined -> reject (error)', function(done) {
		var dfd = q.defer();
		var successCb = sinon.spy();
		var errorCb = sinon.spy();

		stub.returns(dfd.promise);


		lunchFinderService.generateRaitingList()
			.then(successCb, errorCb)
			.done(function() {
				assert.isFalse(successCb.called);
				assert.isTrue(errorCb.called);
				done();
			});

		dfd.resolve();

	});

	it('should generateRaitingList() - 4 - getAll return object -> reject (error)', function(done) {
		var dfd = q.defer();
		var successCb = sinon.spy();
		var errorCb = sinon.spy();

		stub.returns(dfd.promise);


		lunchFinderService.generateRaitingList()
			.then(successCb, errorCb)
			.done(function() {
				assert.isFalse(successCb.called);
				assert.isTrue(errorCb.called);
				done();
			});

		dfd.resolve({});

	});


	it('should generateRaitingList() - 5 - spy on the listUtils', function(done) {
		var dfd = q.defer();
		var successCb = sinon.spy();
		var errorCb = sinon.spy();

		stub.returns(dfd.promise);
		var stub2 = sinon.stub(listUtils, 'getListByRating');


		lunchFinderService.generateRaitingList()
			.then(successCb, errorCb)
			.done(function() {
				assert.isTrue(listUtils.getListByRating.called);
				stub2.restore();
				done();
			});

		dfd.resolve(mockedList);
	});

	it('should getRandomPlaces() - 1 - spy on the utils', function(done) {
		var spy = sinon.stub(listUtils, 'getListWithRandomItems');
		var counter = 96;

		lunchFinderService.getRandomPlaces(counter);

		assert.isTrue(spy.called);
		assert.equal(spy.args[0][1], counter);
		spy.restore();
		done();
	});

});
