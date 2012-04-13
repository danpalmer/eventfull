import urllib, hashlib

def getgravatar(user):
	md5mail = hashlib.md5(user.email)
	return 'http://www.gravatar.com/avatar.php?gravatar_id = '+md5mail+' &default = '+urllib.urlencode('http://intr.ep.io/static/images/default.png')+'&size=20&rating=G'
