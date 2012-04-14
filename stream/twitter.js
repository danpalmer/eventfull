var amqp = require('amqp'); 
var rabbitURL = process.env.CLOUDAMQP_URL || "amqp://localhost";
var conn = amqp.createConnection({url: rabbitURL});
var twitter = require('ntwitter');

var credentials = {
  consumer_key: '9YuHRJVCsdzGxQoB1lfRrg',
  consumer_secret: 'NjFvxvHMFApqvdFrrqiVRZXkgkGYZWLLQhZhlAz58',
  access_token_key: '13166432-YJsxaMwDZFb6p3B33Ukp1MDGqjVk3DrXomLO79kdE',
  access_token_secret: 'hGI2bY15GWGLS9oayYNTi03lsyE7H7fnMf4dAJZEyNI'
}

function streamTweets(exchange, queue) {
	t = new twitter(credentials);
	t.stream('statuses/filter', {'track':'#nationalbestfriendday','locations':'-160.0,-90.0,160.0,90.0'}, function(stream) {
	  stream.on('data', function (data) {
	  	exchange.publish(queue.name, {body: parseTweet(data)});
	  });
	});
}

function parseTweet(data) {
	var tweet = {};
	tweet.user = data.user.screen_name;
	tweet.username = data.user.name;
	tweet.timestamp = data.created_at;
	tweet.text = data.text;
	if (data.place) {
		tweet.place = data.place.full_name;
	}
	if (data.coordinates) {
		tweet.coordinates = data.coordinates;
	}
	if (data.entities) {
		if (data.entities.media) {
			if (data.entities.media[0].media_url) {
				tweet.imageURL = data.entities.media[0].media_url;
			}
		}
		if (data.entities.hashtags) {
			tweet.hashtags = data.entities.hashtags;
		}
	}
	tweet.service = 'twitter';
	return tweet;
}

conn.on('ready', function () {
	var exchange = conn.exchange('');
  var queue = conn.queue('activities-test', {}, function() {
    streamTweets(exchange, queue);
  });
});
