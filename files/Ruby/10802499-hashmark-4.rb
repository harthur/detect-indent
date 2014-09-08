#!/usr/bin/env ruby

require 'digest/sha1'
require 'digest/sha3'
require 'digest/md5'
require 'bcrypt'
require 'securerandom'
require 'benchmark'
require 'pp'
require 'json'
require 'scrypt'
require 'pbkdf2'

class ::Float
    def to_s
        "%.6f" % self
    end
end

class ::Hash
    def to_json
        JSON.generate(self.inject([]) { |array, element|
           array << { 'label' => element.first.to_s, 'data' => element.last[:results] }
        }) << "\n"
    end
end

iterations = 10

password = 'password'
sha_salt = SecureRandom.hex(11)
bcrypt_salt = BCrypt::Engine.generate_salt

sha_password = sha_salt << password

algorithms = {
    :md5    => { :method  => Proc.new { Digest::MD5.hexdigest(sha_password) } },
    :sha1   => { :method  => Proc.new { Digest::SHA1.hexdigest(sha_password) } },
    :sha2   => { :method  => Proc.new { Digest::SHA2.hexdigest(sha_password) } },
    :sha3   => { :method  => Proc.new { Digest::SHA3.hexdigest(sha_password) } },
    :pbkdf2 => { :method  => Proc.new {
        PBKDF2.new(:password => password, :salt => sha_salt, :iterations => 1)
    } },
    :scrypt => { :method  => Proc.new { SCrypt::Password.create(sha_password) } },
    :bcrypt => { :method  => Proc.new { BCrypt::Engine.hash_secret(password, bcrypt_salt) } }
}

algorithms.each { |key, val| val.merge!( { :results => [] } ) }

1000.times do
    algorithms.each do |name, algorithm|
        algorithm[:results] << [
            iterations,
            Benchmark.realtime{iterations.times{algorithm[:method].call}}
        ]
        File.write('/var/www/api/data/hashmark.json', algorithms.to_json)
    end
    iterations += 10
end