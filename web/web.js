var express = require('express');
var app = express.createServer();

app.use('/public', express.static(__dirname + '../public/'));
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.get('/create', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});


var port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log("Listening on " + port);
});