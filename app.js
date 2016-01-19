var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var config     = require('./config');
var app        = express();


// CONFIGURATION
// -----------------------------------------------------------------------------
var port = process.env.PORT || config.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV && config.db && config.db[NODE_ENV]){
	mongoose.connect(config.db[NODE_ENV]);
}



// START THE SERVER
// -----------------------------------------------------------------------------
var server;
var startServer = function(port, callback) {
	server = app.listen(port, callback);
};

var stopServer = function(callback) {
	server.close(callback);
};

if (NODE_ENV === 'development') {
	startServer(port, function() {
		console.log('Working at the http://localhost:' + port + config.version);
	});
}



// MIDDLEWARES
// -----------------------------------------------------------------------------
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', config.siteUrl);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type,x-access-token');

	next();
};

app.use(allowCrossDomain);



// ROUTES
// -----------------------------------------------------------------------------

var router = express.Router();

var lunchFinderApi = require('./app/lunch-finder/lunch-finder.api');
var placesToEatApi = require('./app/places-to-eat/places-to-eat.api');


app.use(config.version, router); //Add url prefix eg.'/api/v1'

router.get('/', function(req, res) {
	res.send('isAlive');
});

router
	// Lunch finder
	.post('/random', lunchFinderApi.random)

	// Places to eat
	.post('/places-to-eat', placesToEatApi.create)
	.get('/places-to-eat', placesToEatApi.getAll)
	.get('/places-to-eat/:id', placesToEatApi.getById)
	.put('/places-to-eat/:id', placesToEatApi.updateById)
	.delete('/places-to-eat/:id', placesToEatApi.deleteById);

module.exports = {
	startServer: startServer,
	stopServer: stopServer
};
