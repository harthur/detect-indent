#!/usr/bin/env python

import numpy as np
from random import shuffle
from scipy.stats import beta

def randAvg(values, target_mean, n, a=None, b=None):
    n = int(n)
    values = sorted(list(values))

    scale = 1/float(values[-1])
    scaled_values = np.array(values) * scale
    scaled_mean = target_mean * scale

    if a:
        b = (a - scaled_mean*a)/scaled_mean
    elif b:
        a = (scaled_mean*b)/(1-scaled_mean)
    
    if a is None and b is None:
        raise ValueError("One of 'a' or 'b' must be set")

    fbeta = beta(a, b)

    bins = np.zeros(len(scaled_values)+1)
    for i in range(len(scaled_values)-1):
        left = scaled_values[i]
        right = scaled_values[i+1]
        bins[i+1] = fbeta.ppf(
                (fbeta.cdf(left) + fbeta.cdf(right))/2
                )
    bins[-1] = 1

    r = fbeta.rvs(size=n)
    counts = np.histogram(r, bins=bins)[0]
    counts = counts.tolist()

    rand_list = []
    for x, y in zip(values, counts):
        rand_list.extend([x]*y)
    shuffle(rand_list)

    return rand_list
    
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
            description="Choose numbers from a given set, \
                    with replacement, so that the mean of \
                    the chosen numbers is close to a given mean.", 
            epilog="Example usage: \
                    %(prog)s -m 0.75 -n 20 0 0.1 0.2 0.25 0.5 0.75 0.8 1.0",
                    )

    parser.add_argument('given_set', 
            metavar='V', 
            type=float, 
            nargs='+', 
            help='Values to choose from',
            )
    parser.add_argument('-m', 
            '--mean', 
            type=float, 
            action='store', 
            required=True, 
            help='Target mean',
            )
    parser.add_argument('-n', 
            type=int, 
            action='store', 
            required=True, 
            help='Number of values to choose',
            )
    parser.add_argument('-a', 
            type=float, 
            action='store', 
            default=None, 
            help="'a' is a parameter in the beta distribution. \
                    Changing this will change how numbers are \
                    selected from the set.",
            )
    parser.add_argument('-b', 
            type=float, 
            action='store', 
            default=0.2, 
            help="'b' is a parameter in the beta distribution. \
                    Changing this will change how numbers are \
                    selected from the set. (default: 0.2)",
            )

    args = vars(parser.parse_args())

    R = randAvg(args['given_set'], args['mean'], args['n'], args['a'], args['b'])
    for r in R:
        print r
