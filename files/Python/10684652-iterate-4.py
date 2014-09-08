#!/usr/bin/env python

import elliptics

host='host'
port=1025
family=2

remote = elliptics.Address(host, port, family)

cfg = elliptics.Config()
cfg.flags = elliptics.config_flags.no_route_list
cfg.wait_timeout = 1
cfg.check_timeout = 1000

elog = elliptics.Logger('/dev/stderr', 3)
n = elliptics.Node(elog, cfg)

n.add_remote(remote)

s = elliptics.Session(n)
s.groups = [5]
s.set_direct_id(host, port)

it = s.start_iterator(s.routes.get_address_eid(remote),
                      [],
                      elliptics.iterator_types.network,
                      elliptics.iterator_flags.default,
                      elliptics.Time(0,0), elliptics.Time(0,0))
for i in it:
    pass
