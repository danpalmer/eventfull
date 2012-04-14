function initialize() {
	var myOptions = {
		zoom: 16,
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
	
	// Get test data
	$.get('http://eventfull.herokuapp.com/data/1',function(data){
		for (var i=0; i < data.length; i++) {
			render(data[i]);
		};
	})
	
	// Render an entry
	function render(entry) {
		var heading, author, location
		service = entry.service
		switch (service) {
			case "twitter":
				heading = entry.text;
				author = entry.user;
				author_link = "http://twitter.com/"+author;
				location = entry.locationText;
				id = entry.id;
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
	}
	
	// Maps stuff
	
	
	
	
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize';
	document.body.appendChild(script);	
	
})