# Copyright Pierre-Luc Bacon <pbacon@cs.mcgill.ca>
#
# This file is part of StarCluster.
#
# StarCluster is free software: you can redistribute it and/or modify it under
# the terms of the GNU Lesser General Public License as published by the Free
# Software Foundation, either version 3 of the License, or (at your option) any
# later version.
#
# StarCluster is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
# details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with StarCluster. If not, see <http://www.gnu.org/licenses/>.

"""Install R packages

Packages are downloaded/installed in parallel, allowing for faster installs
when using many nodes.

For example to install the dtw packages on all the nodes::

    [plugin webapp-packages]
    setup_class = starcluster.plugins.RpkgInstaller.RpkgInstaller
    packages = dtw
"""
from starcluster.clustersetup import DefaultClusterSetup
from starcluster.logger import log
from starcluster.utils import print_timing

class RpkgInstaller(DefaultClusterSetup):
    """Install R packages"""

    def __init__(self, packages="", repo="http://cran.cnr.berkeley.edu"):
        super(RpkgInstaller, self).__init__()
        self.packages = [p.strip() for p in packages.split(",") if p.strip()]
        self.repo = repo

    @print_timing("RpkgInstaller")
    def install_packages(self, nodes, dest='all nodes'):
        log.info("Installing R packages on %s:" % dest)
        cmd = 'R -q -e "install.packages(c(' + ','.join("'%s'" % x for x in self.packages) + '), repos=\'%s\');"'%(self.repo)
        for node in nodes:
            self.pool.simple_job(node.ssh.execute, (cmd,), jobid=node.alias)
        self.pool.wait(len(nodes))

    def run(self, nodes, master, user, user_shell, volumes):
        self.install_packages(nodes)

    def on_add_node(self, node, nodes, master, user, user_shell, volumes):
        self.install_packages([node], dest=node.alias)

    def on_remove_node(self, node, nodes, master, user, user_shell, volumes):
        raise NotImplementedError("on_remove_node method not implemented")
