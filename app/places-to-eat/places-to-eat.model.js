var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	rating: Number,
	imageUrl: String,
	websiteUrl: String,
	tags: [{
		_id : false,
		type: {
			type: String
		}
	}],
	location: {
		mapUrl: String,
		address: String,
		city: String,
		country: String,
		lat: Number,
		lng: Number
	},

	menuPrice: String,
	lunchPrice: String,

	modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Place', PlaceSchema);
