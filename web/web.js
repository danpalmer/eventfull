var express = require('express');
var querystring = require('querystring');
var http = require('http');
var https = require('https');
var app = express.createServer(express.logger());

app.use(express.bodyParser());

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/landing.html');
});

app.get('/event/:id', function (req, res) {
	res.sendfile(__dirname + '/app.html');
});

app.get('/create', function (req, res) {
	res.sendfile(__dirname + '/create.html');
});

app.use('/public', express.static(__dirname + '/../public/'));

app.get('/facebook', function(request, response) {
	if (request.query["hub.verify_token"] == "3") {
		console.log("Challenge: "+request.query["hub.challenge"]);
		response.send(request.query["hub.challenge"]);
	}
});

app.post('/facebook', function(request, response){

	console.log(request.body);

});

app.get('/fbredir', function(request, response){ 

	response.redirect("https://www.facebook.com/dialog/oauth?client_id=302728933133564&redirect_uri=http://eventfull.herokuapp.com/authfb"); 

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
    			console.log(d);
			d.destroy();
  		});
	});

	//console.log("Access_token="+request.query["access_token"]);
	//response.redirect("https://graph.facebook.com/oauth/access_token?client_id=302728933133564&redirect_uri=http://eventfull.herokuapp.com/authfb&client_secret=	8e6de101cc0516b6dd4ebbfea3f11818&code="+request.query["code"]);
});

var port = process.env.PORT || 3001;
app.listen(port, function() {
  console.log("Listening on " + port);
});

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
