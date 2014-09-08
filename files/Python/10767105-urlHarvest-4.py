# URL Harvester written by Andy Bricker 
# http://andybricker.com
# andy at andybricker.com

# Requirements
# Python 2.7 (Has not been tasted on later versions)
# Beautiful Soup library for Python  (http://www.crummy.com/software/BeautifulSoup/)

# Usage: 
#   python urlHarvest.py books stores -n 50 -l myLogFile.txt
#   Google Dorks are supported
#       python urlHarvest.py inurl:.com.eu/foobar.php intext:I like computers -n 50 -l /home/me/logs/myLogFile.txt    

# Script will crawl google collections the specified number of results for a given search.  The script will then
# build a URL array while preventing duplicate entries.  Finally, a line my line logfile is generated containins
# the results.

# Like the script?  Donate
#   LiteCoin: LcFU5upJyS7FsEeB5sb25vFTS69dH6fugr
#   DogeCoin: D7SPH1LYJn9Co4GCZePH3JvzR5RkZEPi5M  


from optparse import OptionParser

options = OptionParser(usage='%prog search [options]', description='Python URL Harvester by Andy Bricker. http://AndyBricker.Com')
options.add_option('-n', '--number', type='int', default=5, help='Number of search results to parse (default: 5)')
options.add_option('-l', '--log_file', type='string', default='urlHarvest.txt', help='Name of the output logfile. Paths accepted. (default: urlHarvest.txt)')


def addLog(target, opts):
    log_file = open(opts.log_file, "a")
    log_file.write(target + '\n')
    log_file.close()     


def main():
    print ""
    print "======================================================="
    print "Checking arguments."
    opts, args = options.parse_args()
    z = 0
    if len(args) < 1:
            options.print_help()
            exit()

    domainList = []

    print "Beginning Google Search of " + str(opts.number) + " records.  Please be patient."
    # Check Google against our search to build URL list
    from google import search   
    for url in search(args[0], stop=opts.number):
        from urlparse import urlparse
        parsed_uri = urlparse( url )
        domain = '{uri.netloc}'.format(uri=parsed_uri)
        domainList.append(domain);

    print "Search Complete, filtering results."
    domainList = list(set(domainList))
    
    print "Building log file."
    for target in domainList:
        addLog(target, opts)   
        
    print "Harvest complete.  Log data written to " + opts.log_file
    print "" 
    print "======================================================="
        
if __name__ == '__main__':
    main()