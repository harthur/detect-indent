# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

	config.vm.box = "hashicorp/precise32"

	config.vm.synced_folder "./", "/var/www", id: "vagrant-root",
	    owner: "vagrant",
	    group: "www-data",
	    mount_options: ["dmode=775,fmode=664"]


	config.vm.provision :shell, :path => "bootstrap.sh"

	config.vm.network :forwarded_port, host: 4567, guest: 80

end