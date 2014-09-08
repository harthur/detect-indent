import requests
import urlparse

def getid(id):
    url = "http://letsrevolutionizetesting.com/challenge.json?"
    r = requests.get(url + id)
    return urlparse.urlsplit(r.json()['follow'])[3]

seed = ""

while True:
    seed = getid(seed)
    print seed

