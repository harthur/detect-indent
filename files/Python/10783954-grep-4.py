#!/usr/bin/env python

"""
downloads tweets to local sqlite database
"""

screen_name = 'YOUR_TWITTER_NAME'

consumer_key = '...'
consumer_secret = '...'
auth_token = '...'
auth_token_secret = '...'

db_file = 'tweets.db'


from twitter import Twitter, OAuth
from twitter.api import TwitterHTTPError
import sys
import sqlite3
from time import sleep
import rfc822

conn = sqlite3.connect(db_file)

c = conn.cursor()
c.execute('create table if not exists tweets (id integer unique, user, text, tstamp)')
c.execute('create index if not exists tweet_index on tweets (text)')

c.execute('select max(id) from tweets')  # select the last id
try:
    since_id = int(c.fetchone()[0])
    print 'since_id', since_id
except:
    since_id = None
    pass

t = Twitter(auth=OAuth(auth_token, auth_token_secret, consumer_key, consumer_secret))


def parse_date(rfcdate):
    d = rfc822.parsedate_tz(rfcdate)
    return '%d-%02d-%02d %02d:%02d:%02d' % d[:6]


def load_tweets(max_id=None, recursive=True):
    min_id = sys.maxint
    args = dict(screen_name=screen_name, count=200, include_rts=True, trim_user=True, include_entities=True)
    if max_id:
        args['max_id'] = max_id
        print 'max_id =', max_id
    if since_id:
        args['since_id'] = since_id
    try:
        res = t.statuses.user_timeline(**args)
    except TwitterHTTPError:
        print TwitterHTTPError
        print "Twitter needs some more time, let's wait 5 secs"
        sleep(5)
        load_tweets(max_id=max_id, recursive=recursive)
        return
    if res:
        for tweet in res:
            min_id = min(min_id, tweet['id'])
            text = tweet['text']
            if 'entities' in tweet:
                for url in tweet['entities']['urls']:
                    if url['expanded_url'] is not None:
                        text = text.replace(url['url'], url['expanded_url'])
            created_at = parse_date(tweet['created_at'])
            user = screen_name
            c.execute('insert or ignore into tweets values (?, ?, ?, ?) ', (tweet['id'], user, text, created_at))
        conn.commit()
        if recursive:
            load_tweets(max_id=min_id - 1)

load_tweets()


def load_favorites(max_id=None, recursive=True):
    min_id = sys.maxint
    args = dict(count=200, include_entities=True)
    if max_id:
        args['max_id'] = max_id
        #print 'max_id =', max_id
    if since_id:
        args['since_id'] = since_id

    try:
        res = t.favorites(**args)
    except TwitterHTTPError:
        print TwitterHTTPError
        print "Twitter needs some more time, let's wait 5 secs"
        sleep(5)
        load_favorites(max_id=max_id, recursive=recursive)
        return
    if len(res) > 0:
        for tweet in res:
            min_id = min(min_id, tweet['id'])
            text = tweet['text']
            if 'entities' in tweet:
                for url in tweet['entities']['urls']:
                    if url['expanded_url'] is not None:
                        text = text.replace(url['url'], url['expanded_url'])
            user = tweet['user']['screen_name']
            created_at = parse_date(tweet['created_at'])
            c.execute('insert or ignore into tweets values (?, ?, ?, ?) ', (tweet['id'], user, text, created_at))
        conn.commit()
        if recursive:
            load_tweets(max_id=min_id - 1)

load_favorites()
