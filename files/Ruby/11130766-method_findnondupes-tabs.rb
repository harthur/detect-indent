# Given an Array, return the elements that are present exactly once in the array.

def non_duplicated_values(ary)
	only_once = []
	ary.each do |i|
		if ary.count(i) == 1 
			only_once << i 
		end 
	end 
	only_once 
end  

puts non_duplicated_values([1,2,2,3,4,4])