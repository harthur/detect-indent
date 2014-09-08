#!/usr/bin/python

ski = 1024
sMi = ski*ski
sGi = sMi*ski

def suffixify(x):
    for u, n in [[sGi, "Gi"], [sMi, "Mi"], [ski, "ki"], [1, ""]]:
        if u == 1 or x > u/2:
            return "{0:.2f}{1}".format(x/u, n)

def print_number(measures, units, number):
    print "{0}: {1}{2}".format(measures, suffixify(number), units)

blake_hash_size = 512/8
blake_rounds = 12
blake_round_steps = 2*4*2*7
# Assume processors are 32-bit and so each op will take 2 clocks
blake_round_clocks = blake_round_steps *2
blake_clocks = blake_round_clocks * blake_rounds
blake_parallelism = 4

catena_lambda = 3
catena_garlic = 18
catena_2garlic = 1<<catena_garlic

processors = 2688
clock_speed = 837E6

blakes_per_sec = processors * clock_speed / blake_clocks
print_number("One password", "s", 
    blake_clocks/blake_parallelism/clock_speed
    *catena_2garlic*catena_lambda)
print_number("One password", "B", blake_hash_size*catena_2garlic)
print_number("Password rate", "/s", blakes_per_sec/catena_2garlic/catena_lambda)
print_number("Memory use", "B", processors/blake_parallelism*blake_hash_size*catena_2garlic)
print_number("Memory bandwidth", "B/s", blakes_per_sec*blake_hash_size)
