import pprint

def getDeepKey(d, keys):
    if len(keys) > 1:
        return getDeepKey(d[keys[0]], keys[1:])
    else:
        return d[keys[0]]

def setDeepKey(d, keys, value):
    if len(keys) > 1:
        key = keys[0]
        if key not in d:
            d[key] = {}
            setDeepKey(d[key] , keys[1:], value)
        else:
            setDeepKey(d[key] , keys[1:], value)
    else:
        d[keys[0]] = value

d = {}
setDeepKey(d, ['this', 'is', 'a', 'deep', 'key'], 'whoa')
setDeepKey(d, ['this', 'is', 'another', 'deep', 'key'], 'yes it is')
pprint.pprint(d)

pprint.pprint(getDeepKey(d, ['this', 'is', 'a', 'deep', 'key']))
pprint.pprint(getDeepKey(d, ['this', 'is']))
