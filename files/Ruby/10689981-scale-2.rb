# Returns a lambda used to determine what number is at t in the range of a and b
#
#   interpolate_number(0, 500).call(0.5) # 250
#   interpolate_number(0, 500).call(1) # 500
#
def interpolate_number(a, b)
  a = a.to_f
  b = b.to_f
  b -= a
  lambda { |t| a + b * t }
end

# Returns a lambda used to determine where t lies between a and b with an ouput
# range of 0 and 1
#
#   uninterpolate_number(0, 500).call(0)   # 0
#   uninterpolate_number(0, 500).call(250) # 0.5
#   uninterpolate_number(0, 500).call(500) # 1.0
#
def uninterpolate_number(a, b)
  a = a.to_f
  b = b.to_f
  b = b - a > 0 ? 1 / (b - a) : 0

  lambda { |x| (x - a) * b }
end

# Returns a closure with the specified input domain and output range
#
#   score = scale([0, 500], [0, 1.0])
#
#   score.call(0) = 0
#   score.call(250) = 0.5
#   score.call(500) = 1.0
#
#
# domain - Array. Input domain
# range  - Array. Output range
#
# Returns lambda
def scale(domain, range)
  u = uninterpolate_number(domain[0], domain[1])
  i = interpolate_number(range[0], range[1])

  lambda do |x|
    x = ([domain[0], x, domain[1]].sort[1]).to_f
    i.call(u.call(x))
  end
end

score = scale([0, 500], [0.0, 1.0])

puts score.call(0)   # 0.0
puts score.call(250) # 0.5
puts score.call(500) # 1.0