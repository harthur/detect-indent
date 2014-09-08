#!/usr/bin/env python
# Tai Sakuma <sakuma@fnal.gov>
import ROOT
import sys
import math
import json
import re
import signal
from optparse import OptionParser

##____________________________________________________________________________||
ROOT.gROOT.SetBatch(1)
ROOT.gSystem.Load("libDelphes")

##____________________________________________________________________________||
GLOBAL_LAST = False

##____________________________________________________________________________||
parser = OptionParser()
parser.add_option('-i', '--inputPath', default = './delphes2.root', action = 'store', type = 'string')
parser.add_option("-n", "--nevents", action = "store", default = -1, type = 'long', help = "maximum number of events to process")
(options, args) = parser.parse_args(sys.argv)
inputPath = options.inputPath

##____________________________________________________________________________||
def main():

    print "%10s" % "event",
    print "%7s" %  "object",
    print "%5s" %  "i",
    print " %8s" % "pT",
    print " %8s" % "eta",
    print " %8s" % "phi",
    print " %8s" % "m",
    print

    if getNEvents(options.inputPath):
        count(options.inputPath)

##____________________________________________________________________________||
def count(inputPath):


    signal.signal(signal.SIGINT, handler)
    events = Events(inputPath, maxEvents = options.nevents, mainTreeName = "Delphes")

    for event in events:

        if GLOBAL_LAST: break

        eventNumber = event.Event[0].Number

        met = event.MissingET[0]
        print "%10d" % eventNumber,
        print "%7s" % "MET",
        print "%5d" % 0,
        print " %8.3f" % met.MET,
        print " %8.3f" % 0.0,
        print " %8.3f" % met.Phi,
        print " %8.3f" % 0.0,
        print

        muons = event.Muon
        i = 0
        for muon in muons:
            print "%10d" % eventNumber,
            print "%7s" % "muon",
            print "%5d" % i,
            print " %8.3f" % muon.PT,
            print " %8.3f" % muon.Eta,
            print " %8.3f" % muon.Phi,
            print " %8.3f" % 0.1056583715,
            print
            i += 1

        jets = event.Jet
        i = 0
        for jet in jets:
            print "%10d" % eventNumber,
            print "%7s" % "jet",
            print "%5d" % i,
            print " %8.3f" % jet.PT,
            print " %8.3f" % jet.Eta,
            print " %8.3f" % jet.Phi,
            print " %8.3f" % jet.Mass,
            print
            i += 1
    return

##____________________________________________________________________________||
def handler( signum, frame ):
    global GLOBAL_LAST
    GLOBAL_LAST = True

##____________________________________________________________________________||
class Events(object):
    def __init__(self, inputPath, maxEvents, mainTreeName):
        self.trees = { }
        self.file = ROOT.TFile.Open(inputPath)
        self.mainTree = self.getTree(mainTreeName)
        self.nEvents = min(self.mainTree.GetEntries(), maxEvents) if (maxEvents > -1) else self.mainTree.GetEntries()

    def __iter__(self):
        return self._next()

    def _next(self):
        iEvent = 0
        while iEvent < self.nEvents:
            if self.mainTree.GetEntry(iEvent) <= 0: return
            iEvent += 1
            yield self

    def __getattr__(self, name):
        return getattr(self.mainTree, name)

    def getTree(self, treeName):
        if treeName in self.trees:
            tree = self.trees[treeName]
        else:
            tree = self.file.Get(treeName)
            self.trees[treeName] = tree
        return tree

##____________________________________________________________________________||
def getNEvents(inputPath):
    file = ROOT.TFile.Open(inputPath)
    delphes = file.Get('Delphes')
    return delphes.GetEntries()

##____________________________________________________________________________||
if __name__ == '__main__':
    main()
