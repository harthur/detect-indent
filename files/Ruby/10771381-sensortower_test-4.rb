require 'mongoid'

Mongoid.logger = Logger.new($stdout)
Moped.logger = Logger.new($stdout)
Mongoid.load!('./mongoid.yml', :development)

class UserFeedback
	include Mongoid::Document

    field :a, :type => Boolean, :as => :analyzed
    field :aa, :type => Boolean, :as => :analyzed_for_app
    field :c, :type => String, :as => :content
    field :d, :type => Time, :as => :date
    field :r, :type => Integer, :as => :rating
    field :t, :type => String, :as => :title
    field :u, :type => String, :as => :username
    field :v, :type => String, :as => :version

end

review_sum = 0
review_count = 0

UserFeedback.all.each do |review|
	if (review.date.year == 2014)
		review_sum += review.rating
		review_count += 1
	end
end

if review_count == 0
	puts "No reviews in 2014"
else
	puts "Average rating for reviews in 2014: #{review_sum / review_count} (#{review_sum.to_f / review_count.to_f})"
end