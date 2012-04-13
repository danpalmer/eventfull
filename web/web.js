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

var port = process.env.PORT || 3001;
app.listen(port, function() {
  console.log("Listening on " + port);
});

