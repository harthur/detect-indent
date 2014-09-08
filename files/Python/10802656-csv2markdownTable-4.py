#-------------------------------------------------------------------------------
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#-------------------------------------------------------------------------------
# Name: csv2markdownTable.py
# Usage: python.exe {Input File(.csv)} {Output File (.md)}
# Description: Converts a .csv to a Markdown Table, for .md table format see:
#    https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#tables
#    Note: not all Markdown viewers support this format
#-------------------------------------------------------------------------------
# Important: the CSV must have a 1st/header row that has the desired 
#            column names to be used
# Method:
#   For every row: 
#     1. Add "|" to start & end of line "|"
#     2. Replace "," with "|"
#   For 1st/header row
#     1. Add header row
#     2. Add a 2nd row with the "|---|---|..."
#-------------------------------------------------------------------------------

import sys
import os

### Params:
### 1 - input file (.csv)
### 2 - output file (.md)

if len(sys.argv) < 3 :
    print 'Usage: {Input File(.csv)} {Output File (.md)}'
    sys.exit(0)

inputFileName  = sys.argv[1]
outputFileName = sys.argv[2]

if not os.path.exists(inputFileName) :
    print 'Input CSV does not exit: ' + inputFileName 
    sys.exit(0)
    
print 'Exporting Input CSV: ' + inputFileName + ' to Output MD: ' + outputFileName

inputFile  = open(inputFileName,  'r')
outputFile = open(outputFileName, 'w')

# Get Line 1 - the first/header row 
line = inputFile.readline().strip()

headerRowCols = line.split(',')

if len(headerRowCols) < 2 :
     print 'Could not find header row in Input CSV: ' + inputFileName
     sys.exit(0)
    
mdHeaderRow = '|' + line.replace(',','|') + '|'

outputFile.write(mdHeaderRow + '\n')   
print 'Processing row: 1 --> ' + mdHeaderRow

mdColumnDef = '---|'
mdTableDefinitionRow = '|'

for col in headerRowCols :
    mdTableDefinitionRow += mdColumnDef

outputFile.write(mdTableDefinitionRow + '\n')
print 'Processing row: 2 --> ' + mdTableDefinitionRow

# Get Line 2 & process rest of file
line = inputFile.readline().strip()

count = 2
while line :
    mdRow = '|' + line.replace(',','|') + '|'
    outputFile.write(mdRow + '\n')
    count=count+1
    print 'Processing row: ' + str(count) + '--> ' + mdRow
    line = inputFile.readline().strip()

inputFile.close()
outputFile.close()
