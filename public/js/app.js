$(function(){
	$.get('/testdata',function(data){
		for (var i=0; i < data.length; i++) {
			render(data[i]);
		};
	})
	
	function render(entry) {
		var heading, author, location
		switch (entry.service) {
			case "twitter":
				heading = entry.text;
				author = entry.user;
				location = entry.locationText;
				break;
			case "facebook":
				heading = entry.text;
				author = entry.user;
				location = entry.locationText;
				break;
		}
		$("<article><h1>"+heading+"</h1><p class='author'>"+author+"</p><p class='location'>"+location+"</p></article>").prependTo("#stream");
	}
	
	
	
})