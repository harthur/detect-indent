require 'json'
require 'rest-client'

url = 'http://reddit.com/.json'

response = RestClient.get(url)
parsed_response = JSON.parse(response)

posts = parsed_response['data']['children'].map do |post|
  { 
    title: post['data']['title'],  
    author: post['data']['author'],
    url: post['data']['url']
  }
end

posts.each do |post|
  puts "Title: #{post[:title]}"
  puts "Author: #{post[:author]}"
  puts "URL: #{post[:url]}"
  puts
end
