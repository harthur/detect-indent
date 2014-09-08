#!/usr/bin/env python
"""
Copyleft 2014 Ian Gallagher <crash@neg9.org>
"""
import sys, os
import OpenSSL

def p12_load(p12_path, passwd):
    # open PKCS12/PFX file, using password.
    p12 = OpenSSL.crypto.load_pkcs12(file(p12_path, 'rb').read(), passwd)

def wordlist_generator(wl_path):
    try:
        with open(wl_path, 'r') as fh:
            for line in fh:
                yield line.strip()
    except Exception as ex:
        raise

def main():
    import optparse
    parser = optparse.OptionParser(usage="Usage: %prog [options] wordlist pkcs_12_file")

    parser.add_option('-d', '--debug', dest='debug', type='int', default=1, help='Debug level (0, 1, 2; default 1)')

    (options, args) = parser.parse_args()

    if len(args) < 1:
        parser.print_usage()
        return(1)

    wl_gen = wordlist_generator(args[0])

    for current_guess in wl_gen:
        try:
            p12_load(args[1], current_guess)
            print "Got password for %s: %s (Python repr: %r)" % (args[1], current_guess, current_guess)
            return(0)
        except OpenSSL.crypto.Error as ex:
            # Password failed, go on to next
            pass

    print "No password found for %s" % (args[1])
    return(1)

if '__main__' == __name__:
    sys.exit(main())

# vim: tabstop=8 expandtab shiftwidth=4 softtabstop=4