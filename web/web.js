var express = require('express');
var querystring = require('querystring');
var http = require('http');
var https = require('https');
var app = express.createServer(express.logger());
var rtg   = require('url').parse(process.env.REDISTOGO_URL);
var redis = require('redis').createClient(rtg.port, rtg.hostname);
var moment = require('moment');

/// Set up the RabbitMQ connection
var amqp = require('amqp'); 
var rabbitURL = process.env.CLOUDAMQP_URL || "amqp://localhost";
var conn = amqp.createConnection({url: rabbitURL});

/// Establish connection to MQ
conn.on('ready', function () {
	var exchange = conn.exchange('');
  var queue = conn.queue('activities-test', {}, function() {
    runServer(exchange, queue);
  });
});

/// Config stuff
redis.auth(rtg.auth.split(':')[1]);
app.use(express.bodyParser());

/// Run the MQ-enabled server
function runServer(exchange, queue) {

	/// Serve static files and HTML client pages
	app.get('/', function (req, res) {
		res.sendfile(__dirname + '/landing.html');
	});

	app.get('/event', function (req, res) {
		res.sendfile(__dirname + '/app.html');
	});

	app.get('/create', function (req, res) {
		res.sendfile(__dirname + '/create.html');
	});

	app.use('/public', express.static(__dirname + '/../public/'));

	/// Create events in redis
	app.post('/create', function (req, res) {
		console.log(req.query);
		console.log(req.body);
		// redis.incr('nextEventID', function (err, newID) {

		// 	redis.hmset('event:'+newID, {
		// 		'name':'',
		// 		'twitterUsername':'',
		// 		'startDate':1,
		// 		'endDate':1,
		// 		'hashtag':'',
		// 		'facebookID':''
		// 	}, function (err) {
		// 		if (err) {console.log(err)};
		// 	});

		// });
	});

	/// Get dynamic data for event
	app.get('/data/:id', function (req, res) {
		res.header('Content-Type', 'application/json');
		redis.lrange('events:1:stream', 0, -1, function (err, data) {
			res.end(JSON.stringify(data));
		});
	});

	/// Facebook magic
	app.get('/facebook', function(request, response) {
		if (request.query["hub.verify_token"] == "3") {
			response.send(request.query["hub.challenge"]);
		}
		else {
			response.redirect('/');
		}
	});

	app.post('/facebook', function(request, response){       
			
		var bodystring = JSON.stringify(request.body);

		var user = request.body.entry[0].uid;

		var time = JSON.stringify(request.body.entry[0].time);

		redis.get("facebook:"+user, function(error, reply) {
			var access_token = reply.toString();	
			var options = {
	  	host: 'graph.facebook.com',
			port: '443',
	  	path: "/"+user+"/feed?access_token="+access_token+"&date_format=U"
		};

		var buffer = [];
		var req = https.get(options, function(res) {
			res.setEncoding('utf8');

			res.on("data", function (data) {
				buffer.push(data);
	  	});

	  	res.on('end', function () {
			  var data = JSON.parse(buffer.join('')).data;
				for (var index in data) {
					if (data[index].updated_time == time) {
						var update = {};
						update.id = data[index].id;
						update.user = user;
						update.username = data[index].from.name;
						update.timestamp = moment(time).format("ddd MMM DD HH:mm:ss Z YYYY");
						update.service = 'facebook';
						
						if (data[index].place) {
							update.place = data[index].place.name;
							update.coordinates = {
								'lat':data[index].place.location.latitude,
								'long':data[index].place.location.longitude
							};
						}
						
						if (data[index].picture) {
							update.imageURL = data[index].picture;
						}

						if (data[index].message) {
							update.text = data[index].message;
						}

						if (data[index].place || data[index].picture || data[index].message) {
							exchange.publish(queue.name, {body: update});
						}

					}
				}
				response.send("");
	  	});
		});
		});
	});

	app.get('/fbredir', function(request, response){ 
		response.redirect("https://www.facebook.com/dialog/oauth?client_id=302728933133564&redirect_uri=http:%2F%2Feventfull.herokuapp.com%2Fauthfb&scope=user_status,user_checkins,read_stream,user_photos&state=magicalstatecode"); 
	});

	app.get('/authfb', function(request, response){

		var options = {
	  	host: 'graph.facebook.com',
			port: '443',
	  	path: "/oauth/access_token?client_id=302728933133564&redirect_uri=http:%2F%2Feventfull.herokuapp.com%2Fauthfb&client_secret=8e6de101cc0516b6dd4ebbfea3f11818&code="+request.query["code"]
		};

		var req = https.get(options, function(res) {
			console.log('STATUS: ' + res.statusCode);
	  	console.log('HEADERS: ' + res.headers);

			res.setEncoding('utf8');

			res.on("data", function(d) {

				d = d.split('=',2)[1];
				d = d.split('&',1)[0];
				var token = d;

				var optionsIDRequest = {
			  	host: 'graph.facebook.com',
					port: '443',
			  	path: "/me/?access_token="+d
				};

				var buffer = [];
				var req = https.get(optionsIDRequest, function(r) {
					r.setEncoding('utf8');

					r.on("data", function (data) {
						buffer.push(data);
			  	});

			  	r.on('end', function () {
						redis.set('facebook:'+JSON.parse(buffer.join('')).id, token, redis.write);
						response.redirect('/create#fbsuccess');
			  	});
				});
			});
		});

	});

	var port = process.env.PORT || 3001;
	app.listen(port, function() {
	  console.log("Listening on " + port);
	});

}
