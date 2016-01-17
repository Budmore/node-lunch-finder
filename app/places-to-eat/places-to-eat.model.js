var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	raitings: Number,
	imageUrl: String,
	websiteUrl: String,
	tags: [{
		name: String,
		type: {
			type: String
		}
	}],
	location: {
		mapUrl: String,
		lat: Number,
		lng: Number
	},
	modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Place', PlaceSchema);
