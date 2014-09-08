#!/usr/bin/env python
import simplejson
from sh import curl

follow = True
url = "http://letsrevolutionizetesting.com/challenge"
while follow:
    x = curl('-H', "Accept: application/json", url)
    json = simplejson.loads(str(x))
    url = json.get('follow', None)
    if url is None:
        print x
        follow = False