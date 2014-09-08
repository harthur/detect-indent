#!/usr/bin/python

import csv
import cooperhewitt.api.client

access_token = 'API_KEY'
hostname = 'api.collection.cooperhewitt.org'

if __name__ == "__main__":

    ifile  = open('tmsids.txt', "rb")
    reader = csv.reader(ifile, delimiter='\t')
    ofile  = open('out.csv', "wb")
    writer = csv.writer(ofile, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL)

    rownum = 0
    newRow = ['tms_id', 'accession']
    writer.writerow(newRow)

    for row in reader:
        api = cooperhewitt.api.client.OAuth2(access_token, hostname=hostname)
        method = 'cooperhewitt.objects.getInfo'
        args = { 'tms_id': row[0] }

        rsp = api.call(method, **args)

        # check if stat is ok
        if rsp['stat'] == 'ok':        
            newRow = [row[0], rsp['object']['accession_number']]
            print newRow
            writer.writerow(newRow)
        else:
            newRow = ["Couldnt find a record for: " + row[0]]
            writer.writerow(newRow)

        rownum += 1

    ifile.close()
    ofile.close()
