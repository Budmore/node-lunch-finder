var sinon = require('sinon');
var assert = require('chai').assert;
var enumsMessages = require('../../app/utils/enumsMessages');
var slackMessageService = require('../../app/messages/slack-message.service');


describe('slack-message.service.js', function() {

	var mocked = {
		title: 'Foo',
		titleLink: 'Boo',
		text: 'Lorem',
		fields: [{type:'lol'}],
		color: '#FF0000'
	};

	it('should createAttachment() - 1 - default color', function() {
		var result = slackMessageService.createAttachment(mocked.title);
		assert.property(result, 'color');
	});

	it('should createAttachment() - 2 - default object', function() {
		var result = slackMessageService.createAttachment(
            mocked.title,
            null,
            mocked.text,
            null,
            null,
            mocked.color
        );

		assert.equal(result.color, mocked.color);
		assert.equal(result.title, mocked.title);
		assert.equal(result.fields, null);
		assert.equal(result.text, mocked.text);
	});


	// createFields()

	it('should createFields() - 1 - return array', function() {
		var fields = slackMessageService.createFields();
		assert.isArray(fields);
		assert.isAbove(fields.length, 0);
	});

	it('should createFields() - 2 - check field property', function() {
		var fields = slackMessageService.createFields();
		var field = fields[0];

		assert.property(field, 'title');
		assert.property(field, 'value');
		assert.property(field, 'short');
	});

	it('should createFields() - 3 - check field value', function() {
		var mocked = {
			lunchPrice: '10pln'
		};

		var fields = slackMessageService.createFields(mocked.lunchPrice);
		var field = fields[0];

		assert.equal(field.value, mocked.lunchPrice);
		assert.equal(field.title, enumsMessages.LUNCH_PRICE);
	});


	// createEmoticons()

	it('should createEmoticons() - 1 - no arguments ', function() {
		var emoticons = slackMessageService.createEmoticons();
		assert.isString(emoticons);
	});

	it('should createEmoticons() - 2 - incorrect arguments ', function() {
		var emoticons = slackMessageService.createEmoticons('foo');
		assert.equal(emoticons, '');
	});

	it('should createEmoticons() - 3 - return string', function() {
		var mocked = [];
		var emoticons = slackMessageService.createEmoticons(mocked);
		assert.equal(emoticons, '');
	});

	it('should createEmoticons() - 4 - return emoticons', function() {
		var mocked = [
			{type: 'foo'},
			{type: 'boo'}
		];
		var emoticons = slackMessageService.createEmoticons(mocked);
		assert.equal(emoticons, ':foo::boo:');
	});


	// messageFormating()

	it('should messageFormating() - 1 - no arguments', function() {
		var message = slackMessageService.messageFormating();
		assert.isUndefined(message);
	});

	it('should messageFormating() - 2 - incorrect arguments', function() {
		var message = slackMessageService.messageFormating('foo');
		assert.isUndefined(message);
	});

	it('should messageFormating() - 3 - empty message', function() {
		var mocked = [];
		var message = slackMessageService.messageFormating(mocked);

		assert.property(message, 'response_type');
		assert.isArray(message.attachments);
	});

	it('should messageFormating() - 4 - spy methods', function() {
		var mocked = [{}];
		var stub0 = sinon.stub(slackMessageService, 'createEmoticons');
		var stub1 = sinon.stub(slackMessageService, 'createFields');
		var stub2 = sinon.stub(slackMessageService, 'createAttachment');

		slackMessageService.messageFormating(mocked);

		assert.isTrue(stub0.called);
		assert.isTrue(stub1.called);
		assert.isTrue(stub2.called);
	});

});
