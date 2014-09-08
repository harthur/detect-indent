def word_count(n):
    wc = dict()
    ## ones
    wc[1] = 3
    wc[2] = 3
    wc[3] = 5
    wc[4] = 4
    wc[5] = 4
    wc[6] = 3
    wc[7] = 5
    wc[8] = 5
    wc[9] = 4
    ## weird teens
    wc[10] = 3
    wc[11] = 6
    wc[12] = 6
    wc[13] = 8
    wc[14] = 8
    wc[15] = 7
    wc[16] = 7
    wc[17] = 9
    wc[18] = 8
    wc[19] = 8
    ## tens 
    wc[20] = 6
    wc[30] = 6
    wc[40] = 5
    wc[50] = 5
    wc[60] = 5
    wc[70] = 7
    wc[80] = 6
    wc[90] = 6
    ## hundreds
    wc[100] = 7
    ## thousands
    wc[1000] = 8
    ## special
    wc[0] = 0
    wc['and'] = 3

    def get_count(n):
        """returns character count for english-repr of n (upto 9999)"""
        if n < 20:
            return wc[n]

        count = 0
        ## thousandth digit
        c_tmp = wc[int(n/1000)]
        ## thousandth digit existed
        if c_tmp > 0:
            c_tmp += wc[1000]

        count += c_tmp

        ## hundreth digit
        c_tmp = wc[int(n/100)%10]
        ## hundreth digit existed
        if c_tmp > 0:
            c_tmp += wc[100]

        count += c_tmp

        print count

        ## tens is tricky b/c of teens/other funky tens
        if (n%100) < 20:
            c_tmp = wc[(n%100)]
            # print int(n/10)%100
        else:
            ## parse out tens digit
            c_tmp = wc[int(n/10)%10 * 10]
            ## parse out ones digit
            c_tmp += wc[n%10]

        ## if 100 digit exist AND 10s digit exist
        ## we need to account for and
        if count > 0 and c_tmp > 0:
            count += wc['and']

        count += c_tmp

        print count, c_tmp

        return count

    # return get_count(n)
    sum = 0
    for i in xrange(1, n+1):
        sum += get_count(i)

    return sum

print word_count(1000)