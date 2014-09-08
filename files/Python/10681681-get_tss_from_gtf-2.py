import HTSeq
import numpy
import sys

gtffile = HTSeq.GFF_Reader( sys.argv[1] )

tsspos = set()
for feature in gtffile:
    if feature.type == "transcript" and feature.source == "HAVANA":
      loc = feature.iv.start_d_as_pos
      row = [loc.chrom, str(loc.pos), str(loc.pos+1), feature.attr["gene_id"], feature.attr["gene_name"], feature.attr["level"]]
      tsspos.add( "\t".join(row) )

for p in tsspos:
  print p
