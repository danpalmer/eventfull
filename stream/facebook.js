var express = require('express');

var app = express.createServer(express.logger());

app.use(express.bodyParser());

app.get('/facebook', function(request, response) {
	if (request.query["hub.verify_token"] == "3") {
		console.log("Challenge: "+request.query["hub.challenge"]);
		response.send(request.query["hub.challenge"]);
	}
});

var port = process.env.PORT || 3000;

app.listen(port);
