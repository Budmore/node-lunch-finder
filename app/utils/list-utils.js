module.exports = {


	config: {
		counter: 3,
		maxLimit: 10
	},


	/**
	 * Create rated list, based on rating points.
	 *
	 * @param  {array} list
	 * @return {array}
	 *
	 * @example

		var list = [
			{ title: 'foo', rating: 5 },
			{ title: 'bar', rating: 3 }
		]

		// ratedList array will contain 8x objects. (5x 'foo' and 3x 'bar')
		var ratedList = getListByRating(list);

	 */
	getListByRating: function(list) {
		if (!list || list.constructor !== Array) {
			return;
		}

		var results = [];

		list.map(function(item) {
			var rating = item.rating || 0;

			for (var i = 0; i < rating; i += 1) {
				results.push(item);
			}
		});

		return results;
	},

	/**
	 * Get random item from array
	 *
	 * @param  {array} list
	 * @return {any|object}
	 */
	getRandomItem: function(list) {
		if (!list || list.constructor !== Array) {
			return;
		}

		if (list.length < 1) {
			return list;
		}

		var item = list[Math.floor(Math.random()*list.length)];

		return item;
	},

	/**
	 * Get list with random items.
	 *
	 * @param  {array}  list
	 * @param  {number} counter - Default 3
	 * @return {array}
	 */
	getListWithRandomItems: function(list, counter) {
		if (!list || list.constructor !== Array) {
			return;
		}

		if (list.length < 1) {
			return list;
		}

		counter = Math.abs(counter) || this.config.counter;
		counter = Math.min(counter, this.config.maxLimit);


		var results = [];

		for ( var i=0; i<counter; i+=1 ) {
			var item = this.getRandomItem(list);
			results.push(item);
		}

		return results;
	}
};
