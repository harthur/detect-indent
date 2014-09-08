#!/usr/bin/env python

import csv
import sys
from pprint import pprint

csvreader = csv.reader(sys.stdin)

# Read the header line and extract the column names
header = csvreader.next()
colindexes = {}
for col,name in enumerate(header):
    colindexes[name] = col

results = []

for lineno, row in enumerate(csvreader):
    colA = row[colindexes["Column A"]]
    colB = row[colindexes["Column B"]]
    colC = row[colindexes["Column C"]]

    # Massage the data in some way
    colD = (int(colA) + int(colB)) * int(colC)
    results.append([colA, colB, colC, colD])

# Print the resulting file to stdout
csvwriter = csv.writer(sys.stdout)
# Write the header row
csvwriter.writerow(["Column A", "Column B", "Column C", "Column D"])

for line in results:
    csvwriter.writerow(line)
