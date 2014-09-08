#!/usr/bin/env python
import re,sys
from Bio import SeqIO

sample1gff3  = sys.argv[1]
sample2gff3  = sys.argv[2]
sample1fasta = sys.argv[3]
sample2fasta = sys.argv[4]

seqs1 = {}
s1 = open(sample1fasta, 'r')
for record in SeqIO.parse(s1, "fasta"):
  seqs1[record.id] = str(record.seq)

seqs2 = {}
s2 = open(sample2fasta, 'r')
for record in SeqIO.parse(s2, "fasta"):
  seqs2[record.id] = str(record.seq)

starts1 = {}
stops1 = {}
ranges1 = {}
s1 = open(sample1gff3, 'r')
for line in s1:
  if line == "" or line.startswith("#"):
    continue

  line = line.rstrip()
  fields = line.split('\t')
  matches = re.search("Parent=([^;]+)", fields[8])
  if fields[2] == "start_codon":
     starts1[matches.group(1)] = fields
  if fields[2] == "stop_codon":
     stops1[matches.group(1)] = fields
for mrnaid in starts1:
  start = starts1[mrnaid]
  stop  = stops1[mrnaid]
  range = "%s_%s-%s" % (start[0], start[3], stop[4])
  if start[6] == "-":
    range = "%s_%s-%s" % (start[0], stop[3], start[4])
  ranges1[range] = mrnaid

starts2 = {}
stops2 = {}
ranges2 = {}
s2 = open(sample2gff3, 'r')
for line in s2:
  if line == "" or line.startswith("#"):
    continue

  line = line.rstrip()
  fields = line.split('\t')
  matches = re.search("Parent=([^;]+)", fields[8])
  if fields[2] == "start_codon":
     starts2[matches.group(1)] = fields
  if fields[2] == "stop_codon":
     stops2[matches.group(1)] = fields
for mrnaid in starts2:
  start = starts2[mrnaid]
  stop  = stops2[mrnaid]
  range = "%s_%s-%s" % (start[0], start[3], stop[4])
  if start[6] == "-":
    range = "%s_%s-%s" % (start[0], stop[3], start[4])
  ranges2[range] = mrnaid

for range in ranges1:
  if range in ranges2:
    s1seq = seqs1["cds." + ranges1[range]]
    s2seq = seqs2["cds." + ranges2[range]]
    if s1seq != s2seq:
      print "%s\t%s\t%s\n%s\n%s\n\n" % (range, ranges1[range], ranges2[range], s1seq, s2seq)