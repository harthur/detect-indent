#!/usr/bin/python
# -*- coding: utf-8 -*-
# hpgl-shapely_hatch - simple Shapely/HP-GL hatching function demo
# scruss — 2014-04-14 — WTFPL (srsly)

from shapely.geometry import box, MultiLineString, Point, LineString
from shapely.affinity import rotate, scale
from shapely import speedups
from math import sqrt

# enable Shapely speedups, if possible
if speedups.available:
    speedups.enable()

def hatchbox(rect, angle, spacing):
    """
    returns a Shapely geometry (MULTILINESTRING, or more rarely,
    GEOMETRYCOLLECTION) for a simple hatched rectangle.

    args:
    rect - a Shapely geometry for the outer boundary of the hatch
           Likely most useful if it really is a rectangle

    angle - angle of hatch lines, conventional anticlockwise -ve

    spacing - spacing between hatch lines

    GEOMETRYCOLLECTION case occurs when a hatch line intersects with
    the corner of the clipping rectangle, which produces a point
    along with the usual lines.
    """
    (llx, lly, urx, ury) = rect.bounds
    centre_x = (urx + llx) / 2
    centre_y = (ury + lly) / 2
    diagonal_length = sqrt((urx - llx) ** 2 + (ury - lly) ** 2)
    number_of_lines = 2 + int(diagonal_length / spacing)
    hatch_length = spacing * (number_of_lines - 1)

    # build a square (of side hatch_length) horizontal lines
    # centred on centroid of the bounding box, 'spacing' units apart
    coords = []
    for i in range(number_of_lines):
        # alternate lines l2r and r2l to keep HP-7470A plotter happy ☺
        if i % 2:
            coords.extend([((centre_x - hatch_length / 2, centre_y
                          - hatch_length / 2 + i * spacing), (centre_x
                          + hatch_length / 2, centre_y - hatch_length
                          / 2 + i * spacing))])
        else:
            coords.extend([((centre_x + hatch_length / 2, centre_y
                          - hatch_length / 2 + i * spacing), (centre_x
                          - hatch_length / 2, centre_y - hatch_length
                          / 2 + i * spacing))])
    # turn array into Shapely object
    lines = MultiLineString(coords)
    # Rotate by angle around box centre
    lines = rotate(lines, angle, origin='centroid', use_radians=False)
    # return clipped array
    return rect.intersection(lines)

def plot_point(pt, pen):
    print 'SP%d;PA%d,%d;PD;PU;' % (pen, int(pt.x), int(pt.y))

def plot_line(line, pen):
    first = 1
    pts = []
    for (x, y) in line.coords:
        if first == 1:
            first = 0
            print 'SP%d;PA%d,%d;PD;' % (pen, int(x), int(y))
        pts.extend((int(x), int(y)))
    print 'PA', ','.join(str(p) for p in pts), ';PU;'

def plot_multiline(multi, pen):
    for i in multi.geoms:
        plot_line(LineString(i.coords), pen)

def plot_poly(poly, pen):
    plot_line(LineString(poly.exterior.coords), pen)
    for i in poly.interiors:
        plot_line(LineString(i.coords), pen)

# Drawing limits: (left 0; bottom 0; right 10300; top 7650)
#  = Letter paper on HP-7470A
# draw a nice page box
page = box(0, 0, 10300, 7650)
innerpage = scale(page, xfact=0.99, yfact=0.99, origin='center')
hatching = hatchbox(page, 45, 100)
# construct crescent
circle = Point(5000, 4000).buffer(3000)
pt = Point(3500, 4000)
circle1 = pt.buffer(2000)
crescent = circle.difference(circle1).simplify(10.0)
crescent_hatch = crescent.intersection(hatching)

# construct a box with a hole in it
weebox = box(8000, 5000, 9500, 7000)
weehatch = hatchbox(weebox, -45, 40)
tbox = scale(weebox, xfact=0.95, yfact=0.95, origin='center')
tinybox = scale(weebox, xfact=0.5, yfact=0.5, origin='center')
holey = tbox.difference(tinybox)
# add fine hatching
holey_hatch = holey.intersection(weehatch)

# plot stuff ..
print 'IN;'                               # cheapo init code
plot_poly(page, 1)                        # outer page border
plot_poly(innerpage, 2)                   # inner page border
plot_point(pt, 2)
plot_multiline(crescent_hatch, 2)         # draw hatching
plot_poly(crescent, 1)                    # draw crescent
plot_multiline(holey_hatch, 1)
plot_poly(holey, 2)                       # ... and hatched box
print 'SP;'
