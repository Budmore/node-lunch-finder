var assert = require('chai').assert;
var listUtils = require('../../app/utils/list-utils');

var mockedLists = {
	lunch: [
		{
			title: 'Burger ltd',
			description: 'Lorem ipsum dolor sit ammet',
			imageUrl: '',
			location: '',
			maps: 'https://www.google.pl/maps/place/Burger+Ltd/@51.1105569,17.0229197,17z/data=!3m1!4b1!4m2!3m1!1s0x470fc20ae152df43:0xa82303f115921c69',
			websiteUrl: 'http://burgerltd.pl/',
			menuUrl: 'http://burgerltd.pl/',
			rating: 1000

		},
		{
			title: 'Random 1',
			rating: 1000
		},
		{
			title: 'Random 2',
			rating: 1000
		}

	],


	emptyList: [],
	smallList: [
		{ name: 'foo'},
		{ name: 'bar'},
		{ name: 'boo'}
	],
	randomList: [
		{_id: 'a__', name: 'foo'},
		{_id: 'bbb', name: 'bar'},
		{_id: 'bbb', name: 'bar'},
		{_id: 'bbb', name: 'bar'},
		{_id: 'bbb', name: 'bar'},
		{name: 'no id'}
	],
	singleElement: [
		{ title: 'Woow' }
	]
};

describe('list-utils.js', function () {


	// getRandomItem()

	it('should getRandomItem() - 1 - get random element from the list', function() {
		var items = mockedLists.lunch;

		var item = listUtils.getRandomItem(items);

		assert.isDefined(item, 'what');
	});

	it('should getRandomItem() - 2 - get random element from one element list', function() {
		var items = mockedLists.singleElement;

		var item = listUtils.getRandomItem(items);

		assert.equal(item, items[0]);
	});


	// getListByRating()

	it('should getListByRating() - 1 - create rated list', function() {
		var ratedList = listUtils.getListByRating(mockedLists.lunch);

		var counter = 0;
		mockedLists.lunch.map(function(item) {
			counter += item.rating && item.rating;
		});

		assert.equal(ratedList.length, counter);
	});

	it('should getListByRating() - 2 - incorrect argument', function() {
		var ratedList = listUtils.getListByRating();

		assert.isUndefined(ratedList);
	});

	it('should getListByRating() - 3 - empty list', function() {
		var result = listUtils.getListByRating(mockedLists.emptyList);
		assert.equal(result.length, 0);
	});


	// getListWithRandomItems()


	it('should getListWithRandomItems() - 1 - incorrect arguments', function() {
		var result = listUtils.getListWithRandomItems();
		assert.isArray(result);
	});

	it('should getListWithRandomItems() - 2 - empty list', function() {
		var result = listUtils.getListWithRandomItems(mockedLists.emptyList);
		assert.equal(result.length, 0);
	});

	it('should getListWithRandomItems() - 3 - Counter is the same size like list', function() {
		var counter = mockedLists.smallList.length;
		var result = listUtils.getListWithRandomItems(mockedLists.smallList, counter);

		assert.equal(result, mockedLists.smallList);
	});

	it('should getListWithRandomItems() - 4 - Counter is bigger than list', function() {
		var counter = mockedLists.smallList.length + 1;
		var result = listUtils.getListWithRandomItems(mockedLists.smallList, counter);

		assert.equal(result, mockedLists.smallList);
	});

	it('should getListWithRandomItems() - 5 - Counter as negative number', function() {
		var counter = -3;
		var result = listUtils.getListWithRandomItems(mockedLists.smallList, counter);

		assert.equal(result.length, 0);
	});


	it('should getListWithRandomItems() - 6 - get uniqe items', function(done) {
		var isDuplicated = false;

		var counter = 2;

		var result = listUtils.getListWithRandomItems(mockedLists.randomList, counter);
		var ids = {};

		result.map(function(item) {
			if (!ids[item._id]) {

				ids[item._id] = true;
			} else {
				isDuplicated = true;
			}

		});
		assert.isFalse(isDuplicated);
		done();
	});


});
