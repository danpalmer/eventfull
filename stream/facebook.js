var express = require('express');

var app = express.createServer(express.logger());

app.get('/facebook', function(request, response) {
	response.send(request.get('hub.challenge'));
	console.log("Challenge: "+request.get('hub.challenge'));
});

var port = process.env.PORT || 3000;

app.listen(port);
