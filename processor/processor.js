var amqp = require('amqp'); 
var rabbitURL = process.env.CLOUDAMQP_URL || "amqp://localhost";
var conn = amqp.createConnection({url: rabbitURL});

conn.on('ready', function () {

	var exchange = conn.exchange('');
	var queue = conn.queue('activities', {}, function() {
    queue.subscribe(function (msg) {
      console.log(msg.body);
	  });
  });

  var queue = conn.queue('activities', {}, function() {
    exchange.publish(queue.name, {body: 'test'});
  });

});
