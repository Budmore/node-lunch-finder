var q = require('q');
var Horseman = require('node-horseman');
var horseman = new Horseman();

module.exports = {

	scrapMenu: function() {

		var dfd = q.defer();
		horseman
			.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
			.open('https://pl-pl.facebook.com/zztopwroclaw/')
			.waitForSelector('.scaledImageFitWidth')
			.evaluate( function(selector){
				// This code is executed inside the browser.
				// It's sandboxed from Node, and has no access to anything
				// in Node scope, unless you pass it in, like we did with "selector".
				//
				// You do have access to jQuery, via $, automatically.
				var src;

				$( selector ).each(function(){
					var width = $(this).attr('width');


					console.log('before', width);

					if (width > 300) {
						src = $(this).attr('src');
						return false;
					}
				});

				return src;


			}, '.scaledImageFitWidth')

			.then(function(size){
				dfd.resolve(size);
				return horseman.close();
			});

		return dfd.promise;
	}
};
