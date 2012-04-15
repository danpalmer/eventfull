function initialize() {
	var myOptions = {
		zoom: 13,
		center: new google.maps.LatLng(51.522396055,-0.1098203659057),
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		mapTypeControl: false,
		streetViewControl: false,
		zoomControl: false
	};

	map = new google.maps.Map(document.getElementById('map'), myOptions);
}

// Render an entry
function render(entry) {
	var heading, author, location, id, author_link, lat, lng;
	service = entry.body.service;

	heading = entry.body.text;
	author = entry.body.user;
	id = entry.body.id;

	if (entry.body.place) {
		location = "at " + entry.body.place;
	} else {
		location = "";
	}

	switch (service) {
		case "twitter":
			author_link = "http://twitter.com/"+entry.body.username;
			if (entry.body.coordinates) {
				lat = entry.body.coordinates.coordinates[0];
				lng = entry.body.coordinates.coordinates[1];
			}
			media = entry.body.imageURL || "";
			if (media != "") {
				media = "<img src='"+media+"'>";
			};
			break;
		case "facebook":
			author_link = "http://facebook.com/"+entry.body.username;
			id = entry.body.id;
			if (entry.body.coordinates) {
				lat = entry.body.coordinates['lat'];
				lng = entry.body.coordinates['long'];
				console.log("Lat: "+lat+", Long: "+lng);
			}
			media = entry.body.imageURL || "";
			if (media != "") {
				media = "<img src='"+media.replace('s.jpg', 'n.jpg')+"'>";
			};
			break;
	}
	// Build entry article
	$("<article id='"+service+"_"+id+"'><img class='service' src='/public/images/services/"+service+".jpg'><h1>"+heading+"</h1><p class='author'><a href='"+author_link+"'>"+author+"</a></p><p class='location'>"+location+"</p>"+media+"</article>").prependTo("#stream");
	
	if (lat && lng) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lng,lat),
			map: map,
			animation: google.maps.Animation.DROP,
			title: heading
		});
	};
}

var updates = [];

$(function(){
	
	function render_loop(data){
		for (var i=data.length-1; i >= 0; i--) {
			console.log("boner");
			single = $.parseJSON(data[i]);
			console.log(single);
			render(single);
		}
	}

	$.get('http://eventfull.herokuapp.com/data/1',function(data){
		render_loop(data);
		update.push(data);
	});

	var pusher = new Pusher('adc860e9e73f74fd5124');
	var channel = pusher.subscribe('event_1');
	
	channel.bind('message', function(data) {
		console.log("pushing...");
	  render(data);
	  update.push(data);
	});
	
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize';
	document.body.appendChild(script);	
	
})
