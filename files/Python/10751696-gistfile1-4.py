import time
import os
import sys
from __pypy__.thread import atomic, last_abort_info
from threading import Thread

N = 3

def conflict(name, x):
    # x = []
    for i in range(N):
        with atomic:
            time.sleep(0.5)
            x.append(name)
#        time.sleep(0.0001)
#        if name == 'a':
#          while 1: pass

def main():
    x = []

    a = Thread(target=conflict, args=("a", x))
    b = Thread(target=conflict, args=("b", x))

    a.start()
    b.start()

    a.join()
    b.join()

    # print 'x:', "".join(map(str, x[:N]))
    # print 'x:', "".join(map(str, x[N:]))
    print x
    print x[:N] == x[N:]
    sys.stdout.flush()

if __name__ == '__main__':
    main()
