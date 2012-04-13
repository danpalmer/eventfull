var express = require('express');

var app = express.createServer(express.logger());

app.get('/facebook', function(request, response) {
	response.send('Test');
});
