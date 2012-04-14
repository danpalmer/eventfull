var express = require('express');
var app = express.createServer(express.logger());

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