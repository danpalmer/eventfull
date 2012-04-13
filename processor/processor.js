var rabbitURL = process.env.RABBITMQ_URL || 'amqp://localhost';
var context = require('rabbit.js').createContext(rabbitURL);

var sub = context.socket('SUB');
sub.connect('activities');
sub.setEncoding('utf8');

sub.on('data', function (note) {
	console.log("Alarum! " + note);
});