var express = require('express');
var querystring = require('querystring');
var http = require('http');
var app = express.createServer(express.logger());

app.get('/', function (req, res) {
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

	var properties = querystring.stringify({
		'client_id' : '302728933133564',
		'redirect_uri': '/authfb',
		'state': state});		

	response.statusCode = 302;
	response.setHeader("Location", "https://www.facebook.com/dialog/oauth"+properties);
	response.end();

});

var port = process.env.PORT || 3001;
app.listen(port, function() {
  console.log("Listening on " + port);
});
