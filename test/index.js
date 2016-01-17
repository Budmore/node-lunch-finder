/**
 *	This aplication use mocha for test framework.
 *	http://mochajs.org/
 *
 *
 *	Available comands:
 *	"npm test"  - single time test (great for Continuous Integration)
 *	"npm run-script test-tdd" - Greate for TDD development
 *
 *
 *
 *	Naming a unit test confenction:
 *	- Method name
 *	- State under test
 *	- Expected behavior / return value
 *
 */


var assert  = require('chai').assert;
var request = require('superagent');

var app     = require('../app');
var config  = require('../config');
var port    = config.port;
var version = config.version;
var baseUrl = 'http://localhost:' + port + version;

describe('App.js', function() {

	before(function(done) {
		app.start(port, done);
	});

	after(function(done) {
		app.stop(done);
	});

	it('should get isAlive message from the server', function(done) {
		var expectedResult = 'isAlive';

		request
			.get(baseUrl + '/')
			.end(function(err, res) {
				assert.isNull(err);
				assert.equal(res.text, expectedResult);
				assert.equal(res.status, 200);
				done();
			});
	});

});
