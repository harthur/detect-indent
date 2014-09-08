require 'algorithms'
include Containers

class NearByController < ApplicationController

	def initialize
		puts 'enter input'
		@input = $stdin.read.split("\n")

		self.format_input

		@topics = @input[0][0].to_i
		@questions = @input[0][1].to_i
		@queries = @input[0][2].to_i
		@tmp_hash = Hash.new
		@topic_coord_hash = Hash.new
		@min_heap = MinHeap.new()

		puts 'output'
		self.output
	end

	def format_input
		for i in 0..@input.size - 1
			@input[i] = @input[i].split(" ") 
		end
	end

	def output
		first = @input.size - @queries
		last = @input.size - 1

		for n in first..last
			query = @input[n]
			x = query[2].to_f
			y = query[3].to_f
			self.topics x, y if query[0].upcase == 'T'
			self.questions x, y if query[0].upcase == 'Q'
			$stdout.print self.pop_heap query[1].to_i
			$stdout.print "\n"
		end

	end

	def pop_heap(num_results)
		result = nil
		count = 0
		flag = false

		until count >= num_results
			tmp = @tmp_hash[@min_heap.pop]
			break if tmp == nil	
			if tmp.class == Array
				count += tmp.size
				if count >= num_results
					tmp = tmp.slice(0, num_results)
					flag = true
				end
				tmp = tmp.join(' ')	
				result = self.set_result result, tmp
				break if flag == true
			else
				count += 1
				result = self.set_result result, tmp
			end
		end

 		result
	end

	def set_result(result, tmp)
		result == nil ? result = tmp + ' ' : result = result + tmp + ' '
	end


	def topics(x, y)
		self.hash_topics_coordinates

		@topic_coord_hash.each do |key, value|
			distance = self.get_distance value[0].to_f, value[1].to_f, x, y
			self.set_tmp_hash distance, key
		end

	end

	def create_min_heap(distance)
		@min_heap.push(distance)
	end

	def get_distance(x1, y1, x2, y2)
		x = x2 - x1 
		y = y2 - y1
		Math.sqrt(power(x, 2) + power(y, 2)).round(3)
	end

	def power(num, pow) 
		num**pow
	end

	def questions(x, y)
		@tmp_hash.clear
		@min_heap.clear
		distance = []
		first = @topics + 1
		last = @topics + @questions 

		for q in first..last
			row = @input[q]
			next if row[1].to_i == 0 
			for i in 2..row.size - 1
				t_x = @topic_coord_hash[row[i]][0]
				t_y = @topic_coord_hash[row[i]][1]
				distance.push(self.get_distance(t_x.to_f, t_y.to_f, x, y))
			end
			distance.sort!
			self.set_tmp_hash distance[0], row[0]
		end

	end

	def set_tmp_hash(distance, id)
		if @tmp_hash.has_key?(distance)
			tmp_arr = [@tmp_hash[distance]]
			tmp_arr.push(id).flatten!
			tmp_arr.sort! { |x,y| y <=> x }
			@tmp_hash[distance] = tmp_arr
		else
			@tmp_hash[distance] = id
			self.create_min_heap distance
		end	
	end

	def hash_topics_coordinates
		topic_id_arr = []
		input = []

		for t in 1..@topics
			row = @input[t]
			topic_id_arr.push(row[0])	
			row.shift
			input.push(row)
		end

		@topic_coord_hash = Hash[topic_id_arr.zip input]
	end

end