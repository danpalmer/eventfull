var express = require('express');
var app = express.createServer();

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/app.html');
});

app.get('/create', function (req, res) {
	res.sendfile(__dirname + '/create.html');
});

app.use('/public', express.static(__dirname + '/../public/'));

var port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log("Listening on " + port);
});