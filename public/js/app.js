var latlngs = [];

function initialize() {
	var myOptions = {
		zoom: 15,
		center: new google.maps.LatLng(51.522396055,-0.1098203659057),
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		mapTypeControl: false,
		streetViewControl: false,
		zoomControl: false
	};

	map = new google.maps.Map(document.getElementById('map'), myOptions);
	
	latlngs = new google.maps.LatLngBounds();
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
				lat = entry.body.coordinates.coordinates[1];
				lng = entry.body.coordinates.coordinates[0];
			}
			media = entry.body.imageURL || "";
			if (media != "") {
				media = "<img src='"+media+"'>";
			};
			break;
		case "facebook":
			author_link = "http://facebook.com/"+entry.body.username;
			id = entry.body.id;
			console.log("FB COORDS DEBUG "+JSON.stringify(entry.body.coordinates));
			if (entry.body.coordinates) {
				lat = entry.body.coordinates.lat;
				lng = entry.body.coordinates.long;
				console.log("Lat: "+lat+", Long: "+lng);
			}
			media = entry.body.imageURL || "";
			if (media != "") {
				media = "<img src='"+media.replace('s.jpg', 'n.jpg')+"'>";
			};
			break;
	}
	// Build entry article
	postHTML = $("<article class='new' id='"+service+"_"+id+"'><img class='service' src='/public/images/services/"+service+".jpg'><h1>"+heading+"</h1><p class='author'><a href='"+author_link+"'>"+author+"</a></p><p class='location'>"+location+"</p>"+media+"</article>").prependTo("#stream").animate({
		"opacity":1
	},500).removeClass("new");
	
	
	
	
	if (lat && lng) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat,lng),
			map: map,
			animation: google.maps.Animation.DROP,
			title: heading
		});
		latlngs.extend(new google.maps.LatLng(lat,lng));
		map.fitBounds(latlngs);
	};
}

var update = [];

$(function(){
	function render_loop(data){
		for (var i=data.length-1; i >= 0; i--) {
			single = $.parseJSON(data[i]);
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
	  render(data);
	  update.push(data);
	});	

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '//maps.googleapis.com/maps/api/js?sensor=false&' +
      'callback=initialize';
  document.body.appendChild(script);
})
