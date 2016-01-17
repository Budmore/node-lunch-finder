var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var config     = require('./config');






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
var start = exports.start = function(port, callback) {
	server = app.listen(port, callback);
};

exports.stop = function(callback) {
	server.close(callback);
};

if (NODE_ENV === 'development') {
	start(port, function() {
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

app.use(config.version, router); //Add url prefix eg.'/api/v1'

router.get('/', function(req, res) {
	res.send('isAlive');
});



