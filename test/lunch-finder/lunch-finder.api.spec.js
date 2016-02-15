var assert = require('chai').assert;
var request = require('superagent');

var app = require('../../app');
var config = require('../../config');
var port = config.port;
var version = config.version;
var baseUrl = 'http://localhost:' + port + version;

var sinon = require('sinon');
var lunchFinderApi = require('../../app/lunch-finder/lunch-finder.api');
var slackMessageService = require('../../app/messages/slack-message.service');

describe.skip('lunch-finder.api.js', function() {

	before(function(done) {
		app.startServer(port, done);
	});

	after(function(done) {
		app.stopServer(done);
	});


	// random()

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

	it('should random() - 1 - spy services', function(done) {
		var stub = sinon.stub(slackMessageService, 'messageFormating');

		var mockedRespond = {
			foo: 'foo',
			boo: 'boo'
		};

		stub.returns(mockedRespond.boo);

		request
			.post(baseUrl + '/random')
			.send(bodyRequest)
			.end(function(err, res) {
				assert.isTrue(stub.called);
				assert.equal(res.body, mockedRespond.boo);

				stub.restore();
				done();
			});

	});


	it.skip('should command() - 1 - random command', function(done) {
		var stub = sinon.stub(lunchFinderApi, 'getRandomPlace');

		bodyRequest.text = 'random';
		request
			.post(baseUrl + '/command')
			.send(bodyRequest)
			.end(function() {
				assert.isTrue(stub.called);
				stub.restore();
				done();
			});

	});


	it('should command() - 2 - return unrecognized commnad', function(done) {

		var mockedRespond = 'Available commands:';

		bodyRequest.text = 'yolo';

		request
			.post(baseUrl + '/command')
			.send(bodyRequest)
			.end(function(err, res) {
				assert.include(res.body, mockedRespond);
				done();
			});

	});

	it('should command() - 3 - scrap lunch menu', function(done) {
		var stub = sinon.stub(lunchFinderApi, 'scrapLunchMenu');

		bodyRequest.text = 'zzTop';

		request
			.post(baseUrl + '/command')
			.send(bodyRequest)
			.end(function() {
				assert.isTrue(stub.called);
				assert.isTrue(stub.calledWithMatch(bodyRequest.response_url, 'zztop'));
				stub.restore();
				done();
			});

	});


});
