[14] pry(main)> def zorak_hash(keys)
[14] pry(main)*   h = {}  
[14] pry(main)*   keys.times {|e| h[e.succ.to_s] = nil }  
[14] pry(main)*   h
[14] pry(main)* end  
=> :zorak_hash
[15] pry(main)> zorak_hash(4)
=> {"1"=>nil, "2"=>nil, "3"=>nil, "4"=>nil}
