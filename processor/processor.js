var amqp = require('amqp'); 
var rabbitURL = process.env.CLOUDAMQP_URL || "amqp://localhost";
var conn = amqp.createConnection({url: rabbitURL});
var Pusher = require('node-pusher');

var pusher = new Pusher({
  appId: '18512',
  key: 'adc860e9e73f74fd5124',
  secret: 'ff3c79d99d995fb1039a'
});

var channel = 'event_1';
var event = 'message';

conn.on('ready', function () {
	var exchange = conn.exchange('');
	var rtg   = require('url').parse(process.env.REDISTOGO_URL);
	var redis = require('redis').createClient(rtg.port, rtg.hostname);
	redis.auth(rtg.auth.split(':')[1]);
	var queue = conn.queue('activities-test', {}, function() {
    queue.subscribe(function (msg) {
      
    	redis.lpush('events:1:stream', msg);
    	pusher.trigger(channel, event, msg, null, function(err, req, res) {
    		console.log(err);
			});

	  });
  });
});
