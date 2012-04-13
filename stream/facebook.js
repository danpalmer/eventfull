var express = require('express');

var app = express.createServer(express.logger());

app.use(express.bodyParser());

app.get('/facebook', function(request, response) {
	response.send(request.params);
	console.log("Challenge: "+request.params);
});

var port = process.env.PORT || 3000;

app.listen(port);
