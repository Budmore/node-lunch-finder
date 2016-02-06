module.exports = {


	config: {
		counter: 3,
		maxLimit: 10
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
			return [];
		}

		counter = counter || this.config.counter;
		counter = Math.min(counter, this.config.maxLimit);

		var listLength = list.length;

		if (counter >= listLength) {
			return list;
		}

		var results = [];
		var pulledIds = {};

		for (var i=0; i<counter; i+=1) {

			var item = this.getRandomItem(list);

			if (pulledIds[item._id]) {
				if (i < listLength) {
					counter += 1;
				}

				continue;
			}

			if (item._id) {
				pulledIds[item._id] = true;
				results.push(item);
			}

		}

		return results;
	}
};
