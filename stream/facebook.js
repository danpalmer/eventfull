var express = require('express');

var app = express.createServer(express.logger());

app.get('/facebook', function(request, response) {
	response.send('Test');
});

var port = process.env.PORT || 3000;

app.listen(port);
