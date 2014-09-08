Map[:king] = -> (pos) do
      ret = []
      (-1..1).each do |x| 
        (-1..1).each do |y| 
          ret << ((pos[0].ord + x).chr + (pos[1].ord + y).chr) if x != 0 || y != 0
        end
      end
      filter_pos(ret)
    end