var enumsMessages = require('../utils/enumsMessages');

module.exports = {
	/**
	 * Create message template for the slack message format.
	 * https://api.slack.com/docs/formatting
	 * https://api.slack.com/docs/attachments
	 *
	 * @param  {array} places
	 * @return {object}
	 */
	messageFormating: function(places, type) {
		if (!places || places.constructor !== Array) {
			return;
		}

		type = type || 'in_channel';

		var message = {
			'response_type': type,
			'attachments': []
		};

		places.map((item) => {
			var emoticons = this.createEmoticons(item.tags);
			var mapUrl = item.location && item.location.mapUrl;

			var fields = this.createFields(
				item.lunchPrice,
				item.menuPrice,
				emoticons,
				mapUrl
			);

			var attachment = this.createAttachment(
                item.name,
                item.websiteUrl,
                item.descripition,
                item.imageUrl,
                fields
            );

			message.attachments.push(attachment);
		});

		return message;
	},

	/**
	 * Create emoticons from tags
	 * eg. burger -> :burger:
	 *
	 * @param  {array} tags
	 * @return {string}
	 */
	createEmoticons: function(tags) {
		if(!tags || tags.constructor !== Array) {
			return '';
		}

		var emoticons = '';

		tags.map(function(tag) {
			if (tag.type) {
				emoticons += ':' + tag.type + ':';
			}
		});


		return emoticons;

	},

	/**
	 * Create fields for the message attachment
	 *
	 * @param  {String} lunchPrice
	 * @param  {String} menuPrice
	 * @param  {String} emoticons
	 * @return {array}
	 */
	createFields: function(lunchPrice, menuPrice, emoticons, mapUrl) {
		var fields = [

			{
				title: enumsMessages.LUNCH_PRICE,
				value: lunchPrice,
				short: true
			},

			{
				title: enumsMessages.MENU_PRICE,
				value: menuPrice,
				short: true
			},
			{
				title: enumsMessages.MENU_PRICE,
				value: emoticons,
				short: true
			},
			{
				title: enumsMessages.LOCATION,
				value: mapUrl,
				short: true
			},
		];

		return fields;
	},

	/**
	 * Create attachment for the slack message
	 *
	 * @param  {String} title
	 * @param  {String} titleLink
	 * @param  {String} text
	 * @param  {String} thumbUrl
	 * @param  {Array} fields
	 * @param  {String} color
	 * @return {object}
	 */
	createAttachment: function(title, titleLink, text, thumbUrl, fields, color) {
		color = color || '#36a64f';

		var attachment = {
			'color': color,
			'title': title,
			'title_link': titleLink,
			'text': text,
			'thumb_url': thumbUrl,
			'fields': fields
		};

		return attachment;
	}

};
