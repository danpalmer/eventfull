var express = require('express');
var querystring = require('querystring');
var http = require('http');
var https = require('https');
var app = express.createServer(express.logger());
//var redis = require("redis").createClient();

app.use(express.bodyParser());

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

	console.log("Received POST: "+bodystring);

	var user = request.body.entry[0].uid;

	var time = JSON.stringify(request.body.entry[0].time);

	console.log("User: "+user+"  Time:"+time);

	var access_token = "AAAETVJKFzPwBAHVv7JfJivQS2spi99cByVZABgZCl877EEZBh0rgSgdoPqzFGbRnge0u500QYqyV0bQ9HiCrL4kwgPWrXxbuRSmgiWkYAZDZD";

	var options = {
  	host: 'graph.facebook.com',
	port: '443',
  	path: "/"+user+"/feed?access_token="+access_token+"&date_format=U"
	};

	console.log("GET: https://graph.facebook.com/"+user+"feed?access_token="+access_token+"&date_format=U");

	var data;

	var req = https.get(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
	  	console.log('HEADERS: ' + res.headers);
  
		res.setEncoding('utf8');

		res.on("data", function(d) {
			console.log("Got data: "+JSON.stringify(d.body));
    			data = d;
			response.send(data);
  		});
	});

	//console.log("Received POST: "+data);
	//response.send(data);

	//for (var item in data.data) {
	//	if (item.updated_time == time) {
	//		response.send(JSON.stringify(item.place));
	//	}
	//}

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
    			response.send(d);
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
