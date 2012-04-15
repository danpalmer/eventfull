function initialize() {
	var myOptions = {
		zoom: 3,
		center: new google.maps.LatLng(51.522396055,-0.1098203659057),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		streetViewControl: false,
		zoomControl: false
	};

	map = new google.maps.Map(document.getElementById('map'), myOptions);

	// markerImage = new google.maps.MarkerImage('/public/pin.png');
	// markerImage.size = new google.maps.Size(32, 39);
	// markerImage.anchor = new google.maps.Point(6, 5);
}


$(function(){
	
	function render_loop(data){
		// data = $.parseJSON(data);
		data = JSON.parse(data);
		// data = data.replace('\\"','"');
		console.log(data);
		// for (var i=0; i < data.length; i++) {
		// 	console.log("boner");
		// 	render(data[i]);
		// }
	}

	// // Get test data
	// $.getJSON({
	// 		url:'http://eventfull.herokuapp.com/data/1',
	// 		success:function(data){
	// 			render_loop(data);
	// 		},
	// 		error:function(data){
	// 			console.log(data);
	// 		},
	// 		dataType:'jsonp'
	// });

	$.get('http://eventfull.herokuapp.com/data/1',function(data){
		render_loop(data);
	});
	
	
	
	// Render an entry
	function render(entry) {
		var heading, author, location, id, author_link, lat, lng;
		service = entry.body.service
		switch (service) {
			case "twitter":
				heading = entry.body.text;
				author = entry.body.user;
				author_link = "http://twitter.com/"+author;
				// location = entry.body.locationText;
				if (entry.body.coordinates) {
					lat = entry.body.coordinates.coordinates[0];
					lng = entry.body.coordinates.coordinates[1];
				}
				location = "Locationings"
				// id = entry.body.id;
				id = "9001";
				if (entry.mediaURL) {
					media = entry.mediaURL;
				}
				break;
			case "facebook":
				heading = entry.text;
				author = entry.user;
				author_link = "http://facebook.com/"+author;
				location = entry.locationText;
				id = entry.id;
				break;
		}
		// Build entry article
		$("<article id='"+service+"_"+id+"'><img class='service' src='/public/images/services/"+service+".jpg'><h1>"+heading+"</h1><p class='author'><a href='"+author_link+"'>"+author+"</a></p><p class='location'>"+location+"</p></article>").prependTo("#stream");
		
		if (lat && lng) {
			console.log("LOCATION BONER");
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lng,lat),
				map: map,
				animation: google.maps.Animation.DROP,
				title: heading
			});
		};
		
		
		
	}
	
	
	// Pusher innit
	
	var pusher = new Pusher('adc860e9e73f74fd5124'); // Replace with your app key
	var channel = pusher.subscribe('event_1');
	
	channel.bind('message', function(data) {
		console.log("pushing...");
	  render(data);
	});
	
	
	
	
	// Maps stuff
	
	
	
	
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize';
	document.body.appendChild(script);	
	
})