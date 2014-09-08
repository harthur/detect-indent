#!/usr/bin/python
# -*- coding: utf-8 -*-

import subprocess

TMP_INSTANCE_UUID = ''
NETWORK_ID = ''
IMAGE_ID = ''
FLAVOR_ID = ''
DEST_HOST = ''
INSTANCE_NAME = ''

def do_shell_cmd(cmd):
    """执行shell命令"""
    p = subprocess.Popen(cmd,
        shell=True, stdout = subprocess.PIPE)

    res = p.stdout.readlines()
    res_without_strip = [i.rstrip() for i in res]

    return res_without_strip

def create_instance_as(uuid):
    global NETWORK_ID, DEST_HOST, INSTANCE_NAME
    _image_id = do_shell_cmd("nova show %(instance_uuid)s|grep image|awk '{ print $5 }'" \
                        % {'instance_uuid': uuid})[0][1:-1]
    _flavor_id = do_shell_cmd("nova show %(instance_uuid)s|grep flavor|awk '{ print $5 }'" \
                        % {'instance_uuid': uuid})[0][1:-1]
    cmd = "nova boot --image %(image_id)s --flavor %(flavor_id)s --nic net-id=%(network_id)s \
            --availability-zone nova:%(host)s %(name)s" \
            % {'image_id': _image_id, 'flavor_id': _flavor_id, 'network_id': NETWORK_ID,
            'host': DEST_HOST, 'name': INSTANCE_NAME}
    print cmd
    do_shell_cmd(cmd)

def create_instance():
    global IMAGE_ID, FLAVOR_ID, NETWORK_ID, DEST_HOST, INSTANCE_NAME
    cmd = "nova boot --image %(image_id)s --flavor %(flavor_id)s --nic net-id=%(network_id)s \
            --availability-zone nova:%(host)s %(name)s" \
            % {'image_id': IMAGE_ID, 'flavor_id': FLAVOR_ID, 'network_id': NETWORK_ID,
            'host': DEST_HOST, 'name': INSTANCE_NAME}
    print cmd
    do_shell_cmd(cmd)

if __name__ == '__main__':
    if TMP_INSTANCE_UUID:
        if NETWORK_ID and DEST_HOST and INSTANCE_NAME:
            create_instance_as(TMP_INSTANCE_UUID)
        else:
            print "params error!"
    else:
        if IMAGE_ID and FLAVOR_ID and NETWORK_ID and DEST_HOST and INSTANCE_NAME:
            create_instance()
        else:
            print "params error!"
