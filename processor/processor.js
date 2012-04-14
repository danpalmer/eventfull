var amqp = require('amqp'); 
var rabbitURL = process.env.CLOUDAMQP_URL || "amqp://localhost";
var conn = amqp.createConnection({url: rabbitURL});

conn.on('ready', function () {
	var exchange = conn.exchange('');
	var rtg   = require('url').parse(process.env.REDISTOGO_URL);
	var redis = require('redis').createClient(rtg.port, rtg.hostname);
	redis.auth(rtg.auth.split(':')[1]);
	var queue = conn.queue('activities-test', {}, function() {
    queue.subscribe(function (msg) {
      

    	redis.lpush('events:1:stream', msg.toString());


	  });
  });
});
