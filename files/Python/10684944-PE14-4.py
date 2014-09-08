LIMIT = 1000000
def collatz(n):
    """generate collatz lengths for 1...n"""
    memo = dict()
    def collatz_recur(m):
        if m == 1:
            return 1
        # check in the memo
        if m in memo:
            return memo[m]

        if m % 2: # odd
            val = 3 * m + 1
            memo[m] = 1 + collatz_recur(val)
            return memo[m]
        else:
            val = m / 2
            memo[m] = 1 + collatz_recur(val)
            return memo[m]

    for i in xrange(2,n):
        collatz_recur(i)

    return memo

ret = collatz(LIMIT)

max_key = max(ret, key=lambda x: ret[x])
print max_key, ret[max_key]