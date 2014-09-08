#!/usr/bin/env python

"""
A pure Python "ping" implementation, based on a rewrite by Johannes Meyer,
of a script originally by Matthew Dixon Cowles. Which in turn was derived
from "ping.c", distributed in Linux's netkit. The version this was forked
out of can be found here: https://gist.github.com/pklaus/856268

The versions this script derived from are licensed under GPL v2, this makes
mandatory that this is licensed under the same terms as well. If it were up
to me I would have made this edit MIT licensed, sorry for not being able to.

I've rewritten nearly everything for enhanced performance and readability,
and removed unnecessary functions (assynchroneous PingQuery and related).
Those of the original comments who still applied to this script were kept.

This new revision is almost fully compliant with Python 3, and packs several
improvements including: Modular importing, better use of operators, overall
code cleanup, separated verbose mode into a dedicated function, added
generator mode to recursive function and others...

A lot was changed on my rewrite, and as far as my tests went it is working
quite beautifully. In any case, bug reports are very much welcome.

Please note that ICMP messages can only be sent by processes ran as root.
"""

from socket import socket, htons, AF_INET, SOCK_RAW, getprotobyname, gethostbyname, error, gaierror
from struct import pack, unpack
from random import random  # Possibly switch to os.urandom()
from select import select
from time import time, sleep
from sys import version_info as py_version

# Remove this line to make all functions public, or selectively add needed functions to make them public.
__all__ = ["create_packet", "echo", "recursive"]

# Python 3 doesn't have the xrange function anymore, this line makes it compliant with both v2 and v3.
xrange = range if py_version[0] >= 3 else xrange

ICMP_ECHO_REQUEST = 8
ICMP_CODE = getprotobyname("icmp")
ERROR_DESCR = {1: "ICMP messages can only be sent from processes running as root.",
               10013: "ICMP messages can only be sent by users or processes with administrator rights."}


def checksum(source_string):
    checksum = 0
    count_to = len(source_string) & -2
    count = 0
    while count < count_to:
        this_val = ord(source_string[count + 1]) * 256 + ord(source_string[count])
        checksum += this_val
        checksum &= 0xffffffff  # Necessary?
        count += 2
    if count_to < len(source_string):
        checksum += ord(source_string[len(source_string) - 1])
        checksum &= 0xffffffff  # Necessary?
    checksum = (checksum >> 16) + (checksum & 0xffff)
    checksum += checksum >> 16
    answer = ~checksum
    answer &= 0xffff
    return answer >> 8 | (answer << 8 & 0xff00)


def create_packet(id):
    """Creates a new echo request packet based on the given "id"."""
    # Builds Dummy Header
    # Header is type (8), code (8), checksum (16), id (16), sequence (16)
    header = pack("bbHHh", ICMP_ECHO_REQUEST, 0, 0, id, 1)
    data = 192 * "Q"

    # Builds Real Header
    header = pack("bbHHh", ICMP_ECHO_REQUEST, 0, htons(checksum(header + data)), id, 1)
    return header + data


def response_handler(sock, packet_id, time_sent, timeout):
    """Handles packet response, returning either the delay or timing out (returns "None")."""
    while True:
        ready = select([sock], [], [], timeout)
        if ready[0] == []:  # Timeout
            return

        time_received = time()
        rec_packet, addr = sock.recvfrom(1024)
        icmp_header = rec_packet[20:28]
        type, code, checksum, rec_id, sequence = unpack("bbHHh", icmp_header)

        if rec_id == packet_id:
            return time_received - time_sent

        timeout -= time_received - time_sent
        if timeout <= 0:
            return


def echo(dest_addr, timeout=1):
    """
    Sends one ICMP echo request to a given host.

    "timeout" can be any integer or float except for negatives and zero.

    Returns either the delay (in seconds), or "None" on timeout or an
    invalid address, respectively.
    """
    try:
        sock = socket(AF_INET, SOCK_RAW, ICMP_CODE)
    except error as err:
        err_num, err_msg = err.args
        if err_num in ERROR_DESCR:
            raise error(ERROR_DESCR[err_num])  # Operation not permitted
        else:
            raise error(err_msg)

    try:
        gethostbyname(dest_addr)
    except gaierror:
        return

    packet_id = int((id(timeout) * random()) % 65535)
    packet = create_packet(packet_id)
    while packet:
        # The ICMP protocol does not use a port, but the function
        # below expects it, so we just give it a dummy port.
        sent = sock.sendto(packet, (dest_addr, 1))
        packet = packet[sent:]

    delay = response_handler(sock, packet_id, time(), timeout)
    sock.close()
    return delay


def recursive(dest_addr, count=8, timeout=1, floodlock=1, generator=False):
    """
    Pings "dest_addr" "count" times and returns a list of replies or yields
    values as they come up if "generator" is True.

    "count" is an integer that defines the ammount of requsts to perform.
    "timeout" is the number of seconds to wait before dropping request.
    "floodlock" regulates the interval between calls to prevent flood
    and is set in seconds.

    If replied, returns echo delay in seconds. If no response is recorded
    "None" is set.
    """
    if generator:
        for i in xrange(count):
            yield echo(dest_addr, timeout)
            sleep(floodlock)
    else:
        log = []
        for i in xrange(count):
            log.append(echo(dest_addr, timeout))
            sleep(floodlock)
        return tuple(log)


###############################################################
# CODE BELOW THIS LINE IS EXPENDABLE FOR DEVELOPMENT PURPOSES #
###############################################################


def verbose(dest_addr, count=8, timeout=1, floodlock=1, infinite=False):
    """Recursive ping with live feedback. Mind the infinity."""
    host = gethostbyname(dest_addr)
    print("PING {} ({}): Ammount {}; Timeout {}s".format(dest_addr, gethostbyname(dest_addr), count, timeout))

    if infinite:
        while True:
            reply = echo(dest_addr, timeout)
            if reply is None:
                print("echo timeout... icmp_seq={}".format(seqn))
            else:
                print("echo from {}:   icmp_seq={}  delay={} ms").format(host, seqn, round(reply*1000, 3))
            sleep(floodlock)
    else:
        log = []
        fail = 0
        for seqn in xrange(count):
            log.append(echo(dest_addr, timeout))
            if log[-1] is None:
                print("echo timeout... icmp_seq={}".format(seqn))
                fail += 1
            else:
                print("echo from {}:   icmp_seq={}  delay={} ms").format(host, seqn, round(log[-1]*1000, 3))
            sleep(floodlock)
        print("sent={} received={} ratio={}%".format(count, count-fail, (float(count-fail) * 100)/count))
        print("{} / {} / {}    (min/avg/max in ms)".format(round(min(log)*1000, 3),
            round(sum([x*1000 for x in log if x is not None])/len(log), 3), round(max(log)*1000, 3)))


# Testing
if __name__ == "__main__":
    verbose("www.heise.de", 4, 2)
    print("")
    verbose("google.com", 4, 2)
    print("")
    verbose("invalid-test-url.com", 4, 2)
    print("")
    verbose("127.0.0.1", 4, 2)
