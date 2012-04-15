$(function(){

	var client_id = 'DC5FCC4O4ZCIUL2XXG5ISAGVP5XM0AA4AUC1SDEJKA230QZ5';
	var callback_url = 'http://eventfull.herokuapp.com/foursquare';

	var oauth_token;

	/* Attempt to retrieve access token from URL. */
	if ($.bbq.getState('access_token')) {
		// you get access_token
		var token = $.bbq.getState('access_token');
		oauth_token = token;
		console.log(token);

		$.get("https://api.foursquare.com/v2/users/self/checkins?oauth_token="+oauth_token,function(data){		
			$.each(data['response']['checkins']['items'], function(index, result){// data.results
				// convert string and put on message queue
				window.location.href = '/create#fssuccess';
				//$('#code').append("<p>"+result.venue.name+"</p>");//get all locations
				
			});
		});
		$.bbq.pushState({}, 2);
	} else if ($.bbq.getState('error')) {
	} else {// you don't have access token
		/* Redirect for foursquare authentication. */
		window.location.href = 'https://foursquare.com/oauth2/authenticate?client_id=' + client_id
		+ '&response_type=token&redirect_uri=' + callback_url;
	} 
})