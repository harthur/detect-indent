# -*- coding: utf-8 -*-
import oauth2 as oauth #
import logging
import sys 
from rdflib import ConjunctiveGraph as Graph
from rdflib import Namespace
from rdflib import URIRef
import urllib
import urllib2
import json
import itertools

class rdioService(object):
    def __init__(self):
        self._consumer_key = '****'
        self._consumer_secret = '****'
        consumer = oauth.Consumer(self._consumer_key, self._consumer_secret)
        self.client = oauth.Client(consumer)
        self._url = 'http://api.rdio.com/1/'

    def searchTracksForArtist(self, artist):
        """
        Find tracks which are made by the artist
        """
        artist_data = self.search('Artist', artist)
        if not artist_data:
            return None
        artist_key = artist_data['key']
        request_query = {'artist':artist_key, 'extras':'-*,name,shortUrl'}
        tracks = self._callAPI('getTracksForArtist', request_query)
        return tracks

    def search(self, types, query):
        """
        Find Album/Artist/Track which matches to query exactly
        """
        query = query.lower()
        request_query = {'query':query, 'types':types, 'extras':'-*,name,shortUrl,key,artist'}
        result = self._callAPI('search', request_query)

        if result.has_key('results'):
            results = result['results']
            # fetch first exact match element
            return next(itertools.ifilter(lambda x:x['name'].lower() == query, results), None)
        else:
            return None
        
    def _callAPI(self, method, values):
        values['method'] = method
        data = urllib.urlencode(self.__encode(values))
        result = self.client.request(self._url, 'POST', data)
        deserialized = json.loads(result[1])
        if deserialized['status'] == 'ok':
            return deserialized['result']
        else:
            print deserialized
            return []
            
    def __encode(self, values):
        return dict([k, v.encode('utf-8') if isinstance(v, unicode) else v] for k, v in values.items())
            
class RdioWrapper(object):
    def __init__(self):
        self._graph_uri = 'http://dbpedia.org/sparql'
        self._service = rdioService()
        logging.basicConfig()
        
    def lookupLinks(self, name):
        """
        Find links between artists and tracks(songs), and generate RDF/XML format data
        !!! should use more information additon to names to search artist data
        """        
        graph = Graph()
        mo = Namespace('http://purl.org/ontology/mo/') # http://musicontology.com/
        graph.namespace_manager.bind('mo',mo)
        
        for name, label in self.getArticles(name):
            tracks = self._service.searchTracksForArtist(name)
            if not tracks:
                print 'not found %s' % name
                continue
            label = label.replace(' ','_')
            dbpedia_resource = URIRef('http://dbpedia.org/resource/'+label)
            for track in tracks:
                track_ref = URIRef(track['shortUrl'])
                graph.add((dbpedia_resource, mo.Track, track_ref))
        return graph.serialize()

    def getArticles(self, name):
        res_uri = 'http://dbpedia.org/resource/' + name
        query = """
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        select distinct ?name, ?label where {
          ## should fetch more detailed data
          ## ex. dbpedia-owl:genre
          <%s> rdfs:label ?label .
          <%s> foaf:name ?name .
          FILTER(LANG(?label) = "en") .
        }
        """ % (res_uri, res_uri)
        import pprint
        results =  self.query({'query':query,'format':'application/sparql-results+json'})
        return [(result['name']['value'], result['label']['value']) for result in results]
        
    def query(self, query):
        data = urllib.urlencode(query)
        result = urllib2.urlopen(self._graph_uri+'?'+data).read()
        return json.loads(result)['results']['bindings']            

if __name__ == '__main__':
    wrapper = RdioWrapper()
    print wrapper.lookupLinks(sys.argv[1].decode())
