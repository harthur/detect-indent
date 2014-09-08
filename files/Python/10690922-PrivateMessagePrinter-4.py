#!/usr/bin/env python3
# © 2014 Aluísio Augusto Silva Gonçalves.  This Source Code Form is
# subject to the terms of the Mozilla Public License, v. 2.0.  If a
# copy of the MPL was not distributed with this file, You can obtain
# one at https://mozilla.org/MPL/2.0/.

from datetime import datetime

# https://bitbucket.org/AluisioASG/textutils.py
from textutils import trim


class PrivateMessage:
    """A phpBB's private message."""

    __slots__ = [
        'subject', 'date', 'message',
        'sender', 'recipient',
        'sent',
    ]

    @classmethod
    def from_etree(cls, msg_elem):
        self = cls()
        self.subject = msg_elem.find('subject').text
        self.message = msg_elem.find('message').text
        date = msg_elem.find('date').text
        # Remove the last double colon (in the timezone).
        if date[-3] == ':' and date[-6] in ('+', '-'):
            date = date[:-3] + date[-2:]
        self.date = datetime.strptime(date, '%Y-%m-%dT%H:%M:%S%z')
        # For received messages, the other party is named
        # in the ``<sender>`` tag.  For sent messages, it's
        # in a ``<recipient>`` tag with attribute ``type="to"``.
        recipient_elem = msg_elem.find('./recipient[@type="to"]')
        if recipient_elem is not None:
            self.sender = 'you'
            self.recipient = recipient_elem.text
            self.sent = True
        else:
            self.sender = msg_elem.find('sender').text
            self.recipient = 'you'
            self.sent = False
        return self

    def __str__(self):
        """Print the private message's details in BBcode."""
        props = {name: getattr(self, name) for name in self.__slots__}
        props['date'] = self.date.strftime('%c')
        return trim("""
            [quote="{sender}, in a message to {recipient}, at {date}"]
            [b]{subject}[/b]
            {message}
            [/quote]
        """).format_map(props)

    def __repr__(self):
        props = {name: getattr(self, name) for name in self.__slots__}
        props['date'] = self.date.strftime('%Y-%m-%d %H:%M:%S %z')
        return trim("""
            <private message
             from {sender} to {recipient},
             dated {date},
             with subject {subject}
            >
        """).replace('\n', '').format_map(props)

def get_privmsgs(etree):
    """Return a sequence of the private messages in a export XML document."""
    return map(PrivateMessage.from_etree, etree.iterfind('privmsg'))


if __name__ == '__main__':
    # We need support for the ``encoding`` argument on ``argparse.FileType``.
    # This is provided starting with Python 3.4.  If using an older version,
    # you can either:
    #
    # 1. Remove the ``encoding`` argument from the call below, **if you're
    #    running on a UTF-8–native environment** (Cygwin included); or
    # 2. Fetch ``argparse.py`` from the 3.4.0 release (available at
    #    http://hg.python.org/cpython/file/04f714765c13/Lib/argparse.py)
    #    and place it next to this script.
    import argparse
    import re
    from xml.etree.ElementTree import parse as etparse

    parser = argparse.ArgumentParser(
        description="Filter and pretty-print phpBB private messages."
    )
    parser.add_argument('file', type=argparse.FileType('r', encoding='utf-8'),
                        metavar="XML_FILE",
                        help="XML export of the private messages")
    parser.add_argument('--party',
                        metavar="USERNAME",
                        help="filter private messages by corresponding party")
    parser.add_argument('--subject',
                        metavar="REGEXP",
                        help="filter private messages by subject")
    parser.add_argument('--message',
                        metavar="REGEXP",
                        help="filter private messages by message text")
    args = parser.parse_args()

    messages = get_privmsgs(etparse(args.file))
    if args.party:
        def correspondent(msg):
            return msg.recipient if msg.sent else msg.sender
        messages = filter(lambda msg: correspondent(msg) == args.party,
                          messages)
    if args.subject:
        regexp = re.compile(args.subject, re.I)
        messages = filter(lambda msg: regexp.search(msg.subject) is not None,
                          messages)
    if args.message:
        regexp = re.compile(args.message, re.I)
        messages = filter(lambda msg: regexp.search(msg.message) is not None,
                          messages)

    print(*messages, sep='\n\n[center]* * *[/center]\n\n')
