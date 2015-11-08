import urllib2
import simplejson
import cStringIO
from PIL import Image

fetcher = urllib2.build_opener()
searchUrl = "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&"
searchTerm = 'point of interest anchorage '
searchUrl += 'q='+'+'.join(searchTerm.split())+ '&'
searchUrl += 'start=1' + '&'
searchUrl += 'imgtype=photo&'
searchUrl += 'safe=active&'
searchUrl += 'rsz=8&'
searchUrl += 'imgsz=xlarge&'
print searchUrl

f = fetcher.open(searchUrl)
deserialized_output = simplejson.load(f)

imageUrl = deserialized_output['responseData']['results'][0]['unescapedUrl']
file = cStringIO.StringIO(urllib2.urlopen(imageUrl).read())
img = Image.open(file)
img.show()