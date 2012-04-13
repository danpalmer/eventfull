var express = require('express');

var app = express.createServer(express.logger());

app.use(express.bodyParser());

app.get('/facebook', function(request, response) {
	response.send(request.body);
	console.log("Challenge: "+request.body);
});

var port = process.env.PORT || 3000;

app.listen(port);
