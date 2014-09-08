# The MIT License (MIT)
#
# Copyright (c) 2014 Victor Robertson
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

import re
import math
import sys

import xml.etree.ElementTree as ET

xmlfile = ''

if len(sys.argv) != 3:
    print 'usage: remove_objects [filename] [distance]'
    exit(1)

filename = sys.argv[1]
max_distance = int(sys.argv[2])

tree = ET.parse(filename)
root = tree.getroot()

delete_queue = []

entities = root.find('SectorObjects')

for entity in entities.findall('MyObjectBuilder_EntityBase'):
    entity_id = entity.find('EntityId').text

    position = entity.find('PositionAndOrientation').find('Position')

    x = float(position.get('x'))
    y = float(position.get('y'))
    z = float(position.get('z'))

    dist = math.sqrt(x**2 + y**2 + z**2)

    if dist > max_distance:
        delete_queue.append(entity)
        print 'entity %s (%.0f, %.0f, %.0f), distance of %.0f' % (entity_id, x, y, z, dist)

if len(delete_queue) > 0:
    response = raw_input('delete these %d objects? [y/n]' % len(delete_queue))

    if response == 'y' or response == 'Y':
        for entity in delete_queue:
            entities.remove(entity)
        tree.write(filename)
else:
    print 'no objects farther than a distance of %.0f' % max_distance 