#!/usr/bin/env python


"""
performs full-text searches on local tweet database and outputs
the results as html. links, @names and #hashtags will be converted
into html links.
"""

db_file = 'tweets.db'

import sqlite3
import sys
import re
from datetime import datetime

link_patterns = [
    (re.compile("\n", re.I), r'<br/>'),
    (re.compile("http://([^\s\)]+)", re.I), r'<a href="http://\1">\g<0></a>'),
    (re.compile("@([^-!\s\)]+)", re.I), r'<a href="https://twitter.com/#!/\1">\g<0></a>'),
    (re.compile("#([^!\s\)]+)", re.I), r'<a href="https://twitter.com/#!/search/%23\1">\g<0></a>'),
]

if len(sys.argv) < 2:
    print "usage: search.py QUERY"
    exit(-1)

query_parts = sys.argv[1:]
query = ' '.join(query_parts)


conn = sqlite3.connect(db_file)

months = 'jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec'.split(',')
years = '2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015'.split(',')

c = conn.cursor()
if query == 'favs':
    c.execute('select user, text, tstamp from tweets where user != "driven_by_data" order by tstamp desc')
    out = '<h2>Favorite Tweets</h2>'
if len(query_parts) == 2 and query_parts[0][:3].lower() in months and query_parts[1] in years:
    m = months.index(query_parts[0][:3].lower())
    c.execute('select user, text, tstamp from tweets where strftime("%Y-%m", tstamp) = ? order by tstamp desc', ('%s-%02d' % (query_parts[1], m),))
    out = '<h2>Tweets and Favorites from %s</h2>' % query
else:
    c.execute('select user, text, tstamp from tweets where text like ?  order by tstamp desc', ("%" + query + "%",))
    out = '<h2>Search Results for "%s"</h2>' % query

now = datetime.today()


def format_delta(delta):
    def format_unit(quantity, unit):
        if quantity != 1:
            unit += 's'
        if quantity < 3:
            quantity = ('zero', 'one', 'two')[quantity]
        return '%s %s' % (str(quantity), unit)
    if delta.days < 1:
        if delta.seconds < 60:
            return format_unit(delta.seconds, 'second')
        if delta.seconds < 3600:
            return format_unit(delta.seconds / 60, 'minute')
        if delta.seconds < 24 * 3600:
            return format_unit(delta.seconds / 3600, 'hour')
    else:
        if delta.days < 7:
            return format_unit(delta.days, 'day')
        if delta.days < 6 * 7:
            return format_unit(delta.days / 7, 'week')
        if delta.days < 300:
            return format_unit(delta.days / 30, 'month')
        return format_unit(delta.days / 365, 'year')


for row in c:
    text = row[1]
    created_at = datetime.strptime(row[2], '%Y-%m-%d %H:%M:%S')
    delta = now - created_at
    time = format_delta(delta) + ' ago'

    for reg, repl in link_patterns:
        text = re.sub(reg, repl, text)
    #print '@' + row[0] + ':', row[1]

    out += '<li><strong>' + row[0] + '</strong> <span>' + time + '</span><br />' + text + '</li>'


html = '''
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>q: %s</title>
    <style>
body { font-family: Helvetica Neue; font-weight: 300; font-size: 15px; line-height: 22px; background: #3C8FC9; }
div { width: 600px; margin: 0 auto; }
h2 { color: rgba(255,255,255,.75);font-weight:300;}
li {
    list-style: none;
    margin-bottom: 15px;
    background: #fff;
    padding: 10px;
    box-shadow: 1px 0px 5px 0px rgba(0,0,0,.4);
    border-radius:10px; }
ul { margin: 0; padding: 0; }
strong { font-weight: bold; }
span { color: #888 }
    </style>
</head>
<body>
    <div>
    %s
    </div>
</body>
</html>''' % (query, out)

open('last-results.html', 'w').write(html.encode('utf-8'))
