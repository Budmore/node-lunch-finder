var assert = require('chai').assert;
var request = require('superagent');

var app = require('../../app');
var config = require('../../config');
var port = config.port;
var version = config.version;
var baseUrl = 'http://localhost:' + port + version;

describe('lunch-finder.api.js', function() {

	before(function(done) {
		app.startServer(port, done);
	});

	after(function(done) {
		app.stopServer(done);
	});


	describe('random() - ', function() {

		it('should random() - 1 - mocked request', function(done) {

			var bodyRequest = {
				'token': 'gIkuvaNzQIHg97ATvDxqgjtO',
				'team_id': 'T0001',
				'team_domain': 'example',
				'channel_id': 'C2147483705',
				'channel_name': 'test',
				'user_id': 'U2147483697',
				'user_name': 'Steve',
				'command': '/weather',
				'text': '94070',
				'response_url': 'https://hooks.slack.com/commands/1234/5678'
			};

			request
				.post(baseUrl + '/random')
				.send(bodyRequest)
				.end(function(err, res) {
					assert.isNull(err);
					assert.isArray(res.body);
					assert.equal(res.status, 200);

					done();
				});

		});

	});


});
