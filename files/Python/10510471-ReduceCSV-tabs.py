#! /usr/bin/env python
"""
Split CSV file into file segments, each with header plus N data rows. 
Recommended for files saved in Windows CSV format.
Useful for situations break up huge CSV file for map/reduce-like processing
(e.g., logs, sensor data, etc.)

: param source : csv_file you want to strip. Must end in .csv 
: param num_rows_per_file : Must be >= 1

Result is a stripped destination csv of name format csv_file_i.csv
	where 'i' is 1 to n (a 'n' is the number of file segments)

Usage: 
	python ReduceCSV.py foo.csv 100 => 
		Reduce foo to files of 100 rows each foo_1.csv, foo_n.csv
"""

import sys
import csv
from sys import argv
from math import ceil


# Check usage and provide help
num_arguments = len(argv)

if num_arguments < 3: # Guidance on arguments to pass
	usage = "Usage: %s input_file.csv num_rows_per_file" % argv[0]
	error = "You passed only %d arguments" % num_arguments
	sys.exit("%s -- %s" % (usage, error))

if '.csv' not in argv[1]: # Ensure using a CSV file
	usage = "Usage: %s input_file.csv num_rows_per_file" % argv[0]
	error = "You passed %r for input_file.csv" % argv[1]
	sys.exit("%s -- %s" % (usage, error))


# Ensure you can open the input file
input_file = argv[1]
try:
	source = open(input_file, 'r')
except:
	e = sys.exc_info()[0]
	sys.exit("Error - Could not open input file %r: %s" % (input_file, e))


# Ensure an int was passed for the number to split
try:
	num_rows_per_file = int(argv[2])
except:
	e = sys.exc_info()[0]
	sys.exit("Error - '%r' is not an integer: %s" % (argv[2], e))


# Get basic file info and number of output files
reader = csv.reader(source)
header = reader.next()
row_count = 0 # Yep, I know I already read in the header_row

for row in reader:
	row_count += 1

if row_count <= 1:
	source.closed
	sys.exit("No data rows in %r" % input_file)

outfile_count = int(ceil(row_count * 1.0 / num_rows_per_file))


# Reset back to first data row (i.e., second row of file)
source.seek(0)
reader.next()


# Now loop through and print each file, with the header
data_write_count = 0 # Keep track of how much you have written out

for segment_num in range(1, outfile_count + 1):
	suffix = '_%04d.csv' % segment_num
	output_file = input_file.strip('.csv') + suffix
	
	# Open the output file for this segment
	try: 
		segment_file = open(output_file, 'w')
		writer = csv.writer(segment_file)
	except:
		e = sys.exc_info()[0]
		sys.exit("Error - Could not open output file %r: %s" % \
			(output_file, e))
	
	# First write the header
	writer.writerow(header)
	
	# Now loop through and write the rows for this segment
	for row in range (0, num_rows_per_file):
		
		# Only print data if any is left
		if data_write_count < row_count:
			data = reader.next()
			writer.writerow(data)
		
		data_write_count += 1
	segment_file.closed # Close the file for this segment


# Let the user know you are done
print 'SUCCESS: Created %d files(s) of up to %d data rows each.\n' % \
 (outfile_count, num_rows_per_file)  


# Be good and close the file
source.closed