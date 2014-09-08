ip = "192.168.10.1"
answer = []

ip.split('.').map(&:to_i).each do |num|
  answer << "%08d" % num.to_s(2)
end

puts answer.join('.')