require 'rubygems'
require 'bundler/setup'
require 'chassis'

class Post
  attr_accessor :id, :title, :text
end

repo = Chassis::Repo.default

puts repo.empty? Post #=> true

post = Post.new
post.title = 'Such Repos'
post.text = 'Very wow. Much design.'

repo.save post

puts post.id #=> 1