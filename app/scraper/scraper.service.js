var superagent = require('superagent');
var q = require('q');

module.exports = {

	scrapFacebookPosts: function() {

		var dfd = q.defer();
		var zzTopUrl = 'https://graph.facebook.com/v2.5/zztopwroclaw/posts?fields=full_picture&limit=1&access_token=CAACEdEose0cBAPPMTCf2R8GHtIslYj1HR3l5XdNhlg162mN3oDTpwAPp9AIiZC3AOGmiZBWXuruKliMUiZCzzPZB1dZCWKOMHVjKrG293fIL5wqwoUWJKawPDRUQAFmK5AZAErB7Pl3Knz7WZAKHNKeZCZAheCaXbYIcBDd3O9iKi2jxZAi6mImfqCa9WpppZBNWlKFD4P7zKku6XPIAA7VvTVp'

		superagent
			.get(zzTopUrl)
			.end(function(err, response) {

				if (err) {
					dfd.reject(err);
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
