%matplotlib inline
from datetime import date, timedelta

RACE_DISTANCE = 200
CLIMBING_DISTANCE = 4219
RACE_DATE = date(2014, 7, 26)

RATE = 0.10
PERCENT_OF_TARGET = .80
TODAY = date.today()


def distance_regression(race_day, race_kilometers, label):
    weeks = (race_day - TODAY).days / 7
    target = race_kilometers * PERCENT_OF_TARGET
    # Calculate how many kilometers to start with assuming 
    # the week before the race is a recovery week and a 
    # weekly increase of RATE until PERCENT_OF_TARGET distance
    # is acheived.
    initial_distance = target / ((1 + RATE)**(weeks - 1))
    def distance(week):
        return int(initial_distance * 1.10**week)
    distances = map(distance, xrange(1, (weeks)))
    
    for distance in distances:
        print("Week {0} {1} Distance: {2}".format(distances.index(distance) + 1, 
                                                  label,
                                                  distance))
    
distance_regression(RACE_DATE, RACE_DISTANCE, label="Total")
print("========================")
distance_regression(RACE_DATE, CLIMBING_DISTANCE, label="Climbing")

    
    