var assert = require('chai').assert;
var request = require('superagent');

var app = require('../../app');
var config = require('../../config');
var port = config.port;
var version = config.version;
var baseUrl = 'http://localhost:' + port + version;

var sinon = require('sinon');
var lunchFinderService = require('../../app/lunch-finder/lunch-finder.service');
var slackMessageService = require('../../app/messages/slack-message.service');

describe('lunch-finder.api.js', function() {

	before(function(done) {
		app.startServer(port, done);
	});

	after(function(done) {
		app.stopServer(done);
	});


	var stub, stub2;

	beforeEach(function() {
		stub = sinon.stub(lunchFinderService, 'getRandomPlaces');
		stub2 = sinon.stub(slackMessageService, 'messageFormating');
	});

	afterEach(function() {
		stub.restore();
		stub2.restore();
	});

	// random()

	it('should random() - 1 - spy services', function(done) {

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

		var mockedRespond = {
			foo: 'foo',
			boo: 'boo'
		};

		stub.returns(mockedRespond.foo);
		stub2.returns(mockedRespond.boo);

		request
			.post(baseUrl + '/random')
			.send(bodyRequest)
			.end(function(err, res) {
				assert.isTrue(stub.called);
				assert.isTrue(stub2.called);
				assert.isTrue(stub2.calledWithMatch(mockedRespond.foo));
				assert.equal(res.body, mockedRespond.boo);

				done();
			});

	});



});
