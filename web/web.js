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

conn.on('ready', function () {
	var exchange = conn.exchange('');
  var queue = conn.queue('activities', {}, function() {
    runServer(exchange, queue);
  });
});

/// Config stuff
redis.auth(rtg.auth.split(':')[1]);
app.use(express.bodyParser());


function getIDFromToken(token) {
	var options = {
  	host: 'graph.facebook.com',
		port: '443',
  	path: "/me/?access_token="+token
	};

	var buffer = [];
	var req = https.get(options, function(res) {
		res.setEncoding('utf8');

		res.on("data", function (data) {
			buffer.push(data);
  	});

  	res.on('end', function () {
			console.log(JSON.parse(buffer.join()));
			return JSON.parse(buffer.join()).id;
  	});
	});
}

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
		id = req.params.id;
		res.send("Got your request for " + id);
	});

	/// Facebook magic
	app.get('/facebook', function(request, response) {
		if (request.query["hub.verify_token"] == "3") {
			console.log("Challenge: "+request.query["hub.challenge"]);
			response.send(request.query["hub.challenge"]);
		}
		else {
			console.log("Someone shouldn't be heeere!");
			response.send("Go away!");
		}
	});

	app.post('/facebook', function(request, response){       
			
		var bodystring = JSON.stringify(request.body);

		//console.log("Received POST: "+bodystring);

		var user = request.body.entry[0].uid;

		var time = JSON.stringify(request.body.entry[0].time);

		console.log("User: "+user+"  Time:"+time);

		var access_token = "AAAETVJKFzPwBAHVv7JfJivQS2spi99cByVZABgZCl877EEZBh0rgSgdoPqzFGbRnge0u500QYqyV0bQ9HiCrL4kwgPWrXxbuRSmgiWkYAZDZD";
		//var access_token = "AAAETVJKFzPwBAIvFLYkqY19RYSV3Q6y0M8G1vEawBvkJcDZCzGpAJPRyrOBM7teYVBXmQ51fCwp4ZAraAvMQU6MTLek0y6DgQB5qwPoAZDZD";

		var options = {
	  	host: 'graph.facebook.com',
			port: '443',
	  	path: "/"+user+"/feed?access_token="+access_token+"&date_format=U"
		};

		//console.log("GET: https://graph.facebook.com/"+user+"/feed?access_token="+access_token+"&date_format=U");

		var buffer = [];
		var req = https.get(options, function(res) {
			res.setEncoding('utf8');

			res.on("data", function (data) {
				buffer.push(data);
	  	});

	  	res.on('end', function () {
			  var data = JSON.parse(buffer.join()).data;
				for (var index in data) {
					if (data[index].updated_time == time) {
						if (data[index].place) {
							var update = {};
							update.user = user;
							update.username = user;

							update.timestamp = moment(time).format('ddd MMM DD HH:mm:ss Z YYYY');
							
							update.place = data[index].name;
							update.service = 'facebook';
							update.coordinates = {
								'lat':data[index].location.latitude,
								'long':data[index].location.longitude,
							}
						}
					}
				}
				response.send("");
	  	});
		});

	});

	app.get('/fbredir', function(request, response){ 
		response.redirect("https://www.facebook.com/dialog/oauth?client_id=302728933133564&redirect_uri=http:%2F%2Feventfull.herokuapp.com%2Fauthfb&scope=user_status,user_checkins,read_stream&state=magicalstatecode"); 
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
				console.log(getIDFromToken(d));

				redis.set('facebook:'+getIDFromToken(d), d);
				response.redirect('/create#fbsuccess');
			});

		});

	});

	var port = process.env.PORT || 3001;
	app.listen(port, function() {
	  console.log("Listening on " + port);
	});

	/// DEBUG: remove!
	app.get('/testdata', function (req, res) {
		res.send([
			{
				'user':'dpalmer.uk',
				'text':'Wow, this is a big station',
				'locationText':'Waterloo',
				'location': {
					'lat':50.9238156,
					'long':-1.391024
				},
				'service':'facebook',
				'timestamp':'Fri Apr 13 17:20:31 +0000 2012',
				'id':190932334432890880,
				'checkin':true
			},
			{
				'user':'@danpalmer',
				'text':'Some more test data',
				'locationText':'White Bear Yard',
				'location': {
					'lat':50.9238156,
					'long':-1.391024
				},
				'service':'twitter',
				'timestamp':'Fri Apr 13 17:50:31 +0000 2012',
				'id':190932334432890880,
				'mediaURL':'http://p.twimg.com/AqZVhfxCEAASVLN.png'
			},
			{
				'user':'@danpalmer',
				'text':'This is a test tweet full of test data...',
				'locationText':'White Bear Yard',
				'location': {
					'lat':50.9238156,
					'long':-1.391024
				},
				'service':'twitter',
				'timestamp':'Fri Apr 13 22:50:31 +0000 2012',
				'id':190932334432890880,
				'mediaURL':'http://p.twimg.com/AqZVhfxCEAASVLN.png'
			}
		]);
	});
}
