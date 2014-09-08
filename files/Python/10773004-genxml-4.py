#!/usr/bin/env pypy


import logging
import sys
import random
import string


log = logging.getLogger(__name__)


ATTR_NAMES = ['id', 'foo', 'bar', 'baz']
ATTR_MAX_VALUE = 1024

TAG_NAMES = ['foo', 'bar', 'baz', 'xyzzy']


def random_string(max_length=8):
    chars = string.lowercase + string.digits
    length = random.randint(1, max_length)
    return ''.join(random.choice(chars) for i in xrange(length))


def write_xml_start(o):
    o.write("<x>\n")
    return 0


def write_xml_end(o):
    o.write("</x>\n")
    return 0


def write_xml_part(o, max_depth=4, max_children=4):
    written = 0
    children = random.randint(1, max_children)
    if max_depth == 0:
        # no more children, write some random content
        rs = random_string()
        o.write(rs + "\n")
        return len(rs) + 1
    for _ in xrange(children):
        tag = random.choice(TAG_NAMES)
        attr_name = random.choice(ATTR_NAMES)
        attr_value = random.randint(1, ATTR_MAX_VALUE)
        tag_start = "<%s %s=\"%s\">\n" % (tag, attr_name, attr_value)
        o.write(tag_start)
        written += len(tag_start)
        written += write_xml_part(o, random.randint(0, max_depth - 1))  # this will write more XML with random depth smaller than our depth
        tag_end = "</%s>\n" % tag
        o.write(tag_end)
        written += len(tag_end)
    return written


def main():
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s %(message)s')
    s = int(sys.argv[1])
    log.debug("generaing xml file of at least %d bytes", s)

    o = sys.stdout
    written = 0

    written += write_xml_start(o)
    while written < s:
        written += write_xml_part(o)
    written += write_xml_end(o)

    log.debug("written %d bytes", written)


if __name__ == '__main__':
    main()

