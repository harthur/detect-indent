# coding: utf-8
import feedparser
import sys, codecs

if not sys.stdout.isatty():
    sys.stdout = codecs.getwriter('utf8')(sys.stdout)

PYVIDEO_FEED_URL = 'http://pyvideo.org/category/50/pycon-us-2014/rss'
d = feedparser.parse(PYVIDEO_FEED_URL)

entries = d.entries

for entry in entries:
    print 'Title: ', entry.title
    if hasattr(entry, 'author'):
        print 'Author: ', entry.author
    print 'Youtube Link: ', entry.links[1].href
    summary = entry.summary
    summary = summary.replace("<p>Abstract</p>", "")
    summary.strip()
    print summary
    print "\n"
