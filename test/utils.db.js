'use strict';

/*
 * Create/kill connection to the spec database.
 *
 * Modified from:
 * https://github.com/elliotf/mocha-mongoose
 * http://www.scotchmedia.com/tutorials/express/authentication/1/06
 */

var config = require('../config');
var mongoose = require('mongoose');


beforeEach(function(done) {

	function clearDB() {
		for (var i in mongoose.connection.collections) {
			mongoose.connection.collections[i].remove(function() {});
		}
		return done();
	}

	if (mongoose.connection.readyState === 0) {
		mongoose.connect(config.db.spec, function (err) {
			if (err) {
				throw err;
			}
			return clearDB();
		});
	} else {
		return clearDB();
	}
});

afterEach(function(done) {
	// Mongoose model overwrite error (on watch)
	// https://github.com/jhnns/rewire/issues/27
	var models = mongoose.connection.models;
	for (var property in models) {
		if (models.hasOwnProperty(property)) {
			delete mongoose.connection.models[property];
		}
	}

	done();
});

after(function(done) {
	// Drop database and disconnet connection to mongodb
	mongoose.connection.db.dropDatabase(function(){
		mongoose.connection.close(function() {
			done();
		});
	});
});
