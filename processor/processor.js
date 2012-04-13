var rabbitURL = process.env.RABBITMQ_URL || 'amqp://localhost';
var context = require('rabbit.js').createContext(rabbitURL);

var sub = context.socket('SUB');
sub.connect('activities');
