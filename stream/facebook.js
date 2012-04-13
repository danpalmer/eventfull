var express = require('express');

var app = express.createServer(express.logger());

app.use(express.bodyParser());

app.get('/facebook', function(request, response) {
	response.send(request.body.hub.challenge);
	console.log("Challenge: "+request.body.hub.challenge);
});

var port = process.env.PORT || 3000;

app.listen(port);
