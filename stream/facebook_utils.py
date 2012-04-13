import urllib, urllib2
import json

FACEBOOK_APP_ID = '173326039428612'
REDIRECT_URI = 'http://intr.ep.io/societies'

def create_request_url(societyname):
	return 'http://www.facebook.com/dialog/oauth?client_id='+FACEBOOK_APP_ID+'&redirect_uri='+urllib.quote(REDIRECT_URI+'/'+societyname+'/fb_callback')+'&scope=manage_pages,publish_stream,offline_access,user_events&response_type=token'


def get_all_pages(access_token):
	response = urllib2.urlopen('https://graph.facebook.com/me/accounts?access_token='+access_token)
	html = response.read()
	dictionary = json.loads(html)
	return dictionary["data"]


def post_message_to_page(page_id, access_token, message):
	url = 'https://graph.facebook.com/'+page_id+'/feed'
	values = {'access_token' : access_token,
          'message' : message}
	data = urllib.urlencode(values)
	print url + '&' + data
	req = urllib2.Request(url, data)
	response = urllib2.urlopen(req)
	return json.loads(response.read())


def post_link_to_page(page_id, access_token, link):
	url = 'https://graph.facebook.com/'+page_id+'/feed'
	values = {'access_token' : access_token,
          'link' : link}
	data = urllib.urlencode(values)
	print url + '&' + data
	req = urllib2.Request(url, data)
	response = urllib2.urlopen(req)
	return json.loads(response.read())



def post_event_to_page(page_id, access_token, event):
	url = 'https://graph.facebook.com/'+page_id+'/events'
	values = {'access_token' : access_token,
          'name' : event.name,
		  'description' : event.description,
		  'start_time' : event.start,
		  'end_time' : event.end,
		  'location' : event.location}
	data = urllib.urlencode(values)
	print url + '&' + data
	req = urllib2.Request(url, data)
	response = urllib2.urlopen(req)
	return json.loads(response.read())

