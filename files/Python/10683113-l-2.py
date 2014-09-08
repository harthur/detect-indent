# Proof of concept Schleiferlturnier-Teamfinder
# Sehr schlichte Implementierung; Idee: Simulated annealing
# Bisher umgesetzt: lediglich zufaelliges Austauschen bei _besserer_ "Energie",
# d.h. keine Fluktuationen mit hoeherer Energie moeglich.
# Weitere Verbesserungsmoeglichkeit: selektives Update Begegnungsmatrix (nicht
# bei jedem Energieupdate komplett von vorn berechnen!!!)
# Aber es scheint trotzdem einigermassen zu gehen :-D
import time

import numpy as np
import random
from matplotlib import pyplot as pp

pp.ion()

random.seed()

# Potential? Vorerst begegnungen^2
# Die "Eigenbegegnungen" gehoeren eigentlich raus, und ein sinnvoller Vergleich muesste her!
# Fluktuation? Um Problemen wechselnder Spielanzahl vorerst aus dem
# Weg zu gehen, schlicht Austausch zweier Spieler!

#Anzahl Spieler
N = 40
#N = 16
#Anzahl zu spielende Spiele
M = 120
#M = 30
#Anzahl Spieler pro Team
L = 4
#L = 4
#zufaellige erste Permutationen fuer saemtliche Teams
teams = np.arange(M*L,dtype=int) % N
np.random.shuffle(teams)
teams.shape = (M,L)

begegnungen = np.zeros((N,N), dtype=int)

begegnungen[0][0] = 6

image = pp.imshow(begegnungen, interpolation="nearest")
pp.show()
pp.colorbar()

for team in teams:
  for i in range(L):
    for j in range(L):
      begegnungen[team[i]][team[j]] += 1

e_hist = []

tic = time.clock()
      
e = np.sum(begegnungen * begegnungen)
#for i in range(1000000):
while True:
  team1 = random.randint(0, M-1)
  team2 = random.randint(0, M-1)
  
  pos1 = random.randint(0, L-1)
  pos2 = random.randint(0, L-1)
  
  if team1 == team2:
    continue
  
  if teams[team1][pos1] == teams[team2][pos2]:
    continue
  
  delta_e = 0
  for j in range(L):
    if j != pos1:
      #Faktor 2 wegen verquerem Energiebegriff ("alles doppelt weil Quadrat statt Dreieck")
      delta_e -= 2 * (2*begegnungen[teams[team1][pos1]][teams[team1][j]]-1)
      delta_e += 2 * (2*begegnungen[teams[team2][pos2]][teams[team1][j]]+1)
      
    if j != pos2:
      delta_e -= 2 * (2*begegnungen[teams[team2][pos2]][teams[team2][j]]-1)
      delta_e += 2 * (2*begegnungen[teams[team1][pos1]][teams[team2][j]]+1)
  
  if delta_e <= 0:
    #austauschen!
    p1 = teams[team1][pos1]
    p2 = teams[team2][pos2]
    teams[team1][pos1] = p2
    teams[team2][pos2] = p1
    
    e += delta_e
    
    #begegnungen neu berechnen, naja, idealerweise selektiver!
    begegnungen = np.zeros((N,N), dtype=int)
    for team in teams:
      for j in range(L):
        for l in range(L):
          begegnungen[team[j]][team[l]] += 1
    
    begegnungen_plot = np.copy(begegnungen)
    begegnungen_plot *= (1-np.identity(N, dtype=int))

    image.set_data(begegnungen_plot)
    pp.draw()
    print i, "," , e

toc = time.clock()
print "Time: ", toc - tic
a = input("Pause")