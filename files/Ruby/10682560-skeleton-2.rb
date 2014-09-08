require 'rubygems'
require 'bundler/setup'

require 'fog/rackspace'
require 'pry'

provider_config = {
  :provider => 'rackspace',
  :rackspace_username => ENV['RACKSPACE_USERNAME'],
  :rackspace_api_key  => ENV['RACKSPACE_API_KEY'],
  :rackspace_region => :dfw
}

compute = Fog::Compute.new(provider_config)

binding.pry

