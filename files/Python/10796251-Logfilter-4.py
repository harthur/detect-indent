import sys, re

#Hey! this code uses regular expressions. Meant to take file input
#Its technically incomplete, there's a few things a small one-line additions I need to add,
#But this filters out a lot of unnesecary text.

#This /does/ not filter pages, on purpose.

OocChat        = re.compile("^<.*>")
PagingFromSay  = re.compile("^.*pages:")
PagingToSay    = re.compile("^You paged .* with '")
PagingFromDo   = re.compile("^From afar,")
PagingToDo     = re.compile("^Long Distance to .*:")
AfterLogon     = re.compile("^-* BBS")
Who            = re.compile("^<>* Message")
Whoend         = re.compile("^<>*Unique")
BasicInfo      = re.compile("^<>")
Teleporter     = re.compile("^Teleporter: ")
Error          = re.compile('^Huh. *.Type "help" for help..\n$')
Connected      = re.compile("^.* has.*connect")
NewActivity    = re.compile("^-* New Activity -*\n$")
AllChannels    = re.compile("^All channels have been gagged.\n$")
StopGagging    = re.compile("^You must stop gagging that channel to speak on it.\n$")
IsFollowing    = re.compile("^.*begins following you.\n$")


Donebeginning = False
who = False
where = False
for line in sys.stdin:
    if Donebeginning == False:
        Donebeginning = bool(AfterLogon.match(line))
        continue
    if bool(AfterLogon.match(line)): continue
    if bool(Who.match(line)): who = True
    if who == True:
        if bool(Whoend.match(line)): who = False
        continue
    if bool(Whoend.match(line)): continue
#Took the net three out because they make things go wonky if +oocfinger is used (I'll have my own way of filtering that later)
    #if bool(BasicInfo.match(line)): where = not where
    #if where: continue
    #if bool(BasicInfo.match(line))  : continue
    if bool(Connected.match(line))  : continue
    if bool(OocChat.match(line))    : continue
    if bool(Teleporter.match(line)) : continue
    if bool(Error.match(line))      : continue
    if bool(StopGagging.match(line)): continue
    if bool(NewActivity.match(line)): continue
    if bool(AllChannels.match(line)): continue
    if bool(IsFollowing.match(line)): continue
    print(line.rstrip())
