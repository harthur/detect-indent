"""
  File name: gp_from_string_fix.py
  Author: Thomas Macrina
  Date created: 04/15/2014
  Python Version: 2.7
 
Simple DEAP strongly-typed GP setup to demonstrate
difficulties with ephemerals and scoop.
"""

import sys
import json
import math
import random
import __builtin__

from operator import *

from deap.gp import PrimitiveSetTyped, PrimitiveTree
from deap import gp
from deap import algorithms
from deap import base
from deap import creator
from deap import tools

from scoop import futures


class Top():
    def __init__(self, x, y):
        self.d = {"x": x, "y": y}
        
def top(x, y):
    return Top(x, y)           

def n_int():
    return random.randint(5, 20)
        
pset = PrimitiveSetTyped("main", [int], Top)
pset.renameArguments(ARG0='a')
pset.addPrimitive(top, [int, int], Top, "top")
pset.addPrimitive(add, [int, int], int)
pset.addEphemeralConstant("i", n_int, int)

def evaluate(ind):
    com = gp.compile(expr=ind, pset=pset)
    d = com(1)
    return d.d["x"] - d.d["y"]

# initialize creator
creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", gp.PrimitiveTree, fitness=creator.FitnessMax)

# initialize toolbox
toolbox = base.Toolbox()
toolbox.register("rules", gp.genGrow, pset=pset, min_=2, max_= 4, type_=Top)
toolbox.register("individual", tools.initIterate, creator.Individual, toolbox.rules)
toolbox.register("population", tools.initRepeat, list, toolbox.individual)
toolbox.register("evaluate", evaluate)

# mutation, crossover, selection
toolbox.register("select", tools.selTournament, tournsize=2)
toolbox.register("mate", gp.cxOnePoint)
toolbox.register("expr_mut", gp.genFull, min_=0, max_=2)
toolbox.register("mutate", gp.mutUniform, expr=toolbox.expr_mut, pset=pset)
toolbox.register("map", futures.map)

    
def evolve(NGEN=3, NPOP=5, CXPB=0.90, MUTPB=0.01):
    
    pop = toolbox.population(NPOP)
    
    for g in range(NGEN):
        # Select the next generation individuals
        offspring = toolbox.select(pop, len(pop))
        # Clone the selected individuals
        offspring = map(toolbox.clone, offspring)

        # Apply crossover on the offspring
        for child1, child2 in zip(offspring[::2], offspring[1::2]):
            if random.random() < CXPB:
                toolbox.mate(child1, child2)
                del child1.fitness.values
                del child2.fitness.values

        # Apply mutation on the offspring
        for mutant in offspring:
            if random.random() < MUTPB:
                toolbox.mutate(mutant)
                del mutant.fitness.values

        # Evaluate the individuals with an invalid fitness
        invalid_ind = [ind for ind in offspring if not ind.fitness.valid]
        fitnesses = toolbox.map(toolbox.evaluate, invalid_ind)
        n = 0
        for ind, fit in zip(invalid_ind, fitnesses):
            n += 1
            ind.fitness.values = (fit,)
            print str(n) + " / " + str(len(invalid_ind)) + "\n"
            print ind, fit
            print "\n"

        # The population is entirely replaced by the offspring
        pop[:] = offspring

if __name__ == "__main__":
    evolve()
    