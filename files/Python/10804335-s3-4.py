#!/usr/bin/python
#
# Author:: Noah Kantrowitz <noah@coderanger.net>
#
# Copyright 2013-2014, Balanced, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import hashlib
import hmac
import json
import sys
import urllib2
import urlparse

class Message(object):
    CODES = {
        100: 'Capabilities',
        102: 'Status',
        200: 'URI Start',
        201: 'URI Done',
        600: 'URI Acquire',
        601: 'Configuration',
    }

    def __init__(self, code, headers, **kwargs):
        if code not in self.CODES:
            raise ValueError('Unknown code {0}'.format(code))
        self.code = code
        self.headers = headers + kwargs.items()

    @classmethod
    def from_lines(cls, lines):
        status_line = lines.pop(0)
        code = int(status_line.split()[0])
        headers = []
        for line in lines:
            line = line.strip()
            if not line:
                continue
            parts = [p.strip() for p in line.split(':', 1)]
            if len(parts) != 2:
                continue
            headers.append(parts)
        return cls(code, headers)

    @property
    def message(self):
        return self.CODES[self.code]

    def encode(self):
        buf = ['{0} {1}\n'.format(self.code, self.message)]
        for key, value in self.headers:
            buf.append('{0}: {1}\n'.format(key, value))
        buf.append('\n')
        return ''.join(buf)

    def __getitem__(self, header):
        for key, value in self.headers:
            if key == header:
                return value


class AptS3(object):
    MessageClass = Message

    def __init__(self, inf=sys.stdin, outf=sys.stdout):
        self.inf = inf
        self.outf = outf
        self.apt_config = {}
        self.access_key_id = ''
        self.secret_access_key = ''
        self.token = None

    def read_config(self, path):
        try:
            data = json.load(open(path, 'wb'))
        except (IOError, ValueError):
            pass
        else:
            self.access_key_id = data.get('access_key_id')
            self.secret_access_key = data.get('secret_access_key')
            self.token = data.get('token')

    def send(self, msg, *args, **kwargs):
        if not isinstance(msg, self.MessageClass):
            msg = self.MessageClass(msg, *args, **kwargs)
        self.outf.write(msg.encode())

    def send_capabilities(self):
        self.send(100, [
            ('Version', '1.2'),
            ('Send-Config', 'true'),
        ])

    def read_messages(self):
        buf = []
        for line in sys.stdin:
            if line == '\n':
                if buf:
                    # Decode and handle a message
                    msg = self.MessageClass.from_lines(buf)
                    buf = []
                    self.handle(msg)
            else:
                buf.append(line)

    def handle(self, msg):
        fn = getattr(self, 'handle_{0}'.format(msg.code), None)
        if not fn:
            raise ValueError('No handler for code {0}'.format(msg.code))
        return fn(msg)

    def handle_600(self, msg):
        """Handle a 600 URI Acquire message."""


    def handle_601(self, msg):
        """Handle a 600 Configuration message."""
        for key, value in msg.headers:
            if key != 'Config-Item':
                continue
            sub_key, sub_value = value.split('=', 1)
            self.apt_config[sub_key] = sub_value


    def s3_request(self, url):
        pass

if __name__ == '__main__':
    apt_s3 = AptS3()
    apt_s3.read_config('/etc/apt/s3.json')
    apt_s3.send_capabilities()
    apt_s3.read_messages()


