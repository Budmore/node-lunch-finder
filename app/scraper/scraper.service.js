var superagent = require('superagent');
var config = require('../../config');
var q = require('q');

var domain = 'https://graph.facebook.com/v2.5';
var credentials = config.fb;

module.exports = {

	/**
	 * @param  {string} name
	 * @return {promise}
	 */
	getPictureFromFacebookPost: function(name) {

		var pageId = name || 'zztopwroclaw';

		var dfd = q.defer();
		var pageUrl = domain + '/' + pageId + '/posts';

		superagent
			.get(pageUrl)
			.query({
				fields: 'full_picture',
				limit: 1,
				'access_token': credentials.appId + '|' + credentials.appSecret
			})
			.end(function(err, response) {

				if (err) {
					return dfd.reject(err);
				}

				var responseText = JSON.parse(response.text || '{}');

				var data = responseText.data;

				if (data && data.constructor === Array) {
					var fullPicture = data[0] && data[0].full_picture;
					dfd.resolve(fullPicture);
				} else {
					dfd.reject(data);
				}

			});

		return dfd.promise;
	}
};
