require 'set'

class TwoPowArray
  def self.make(count)
    pow_arr = Array.new(count)

    pow_arr.length.times do |pow|
      pow_arr[pow] = 2 ** pow
    end

    pow_arr
  end
end

class TwoPowSet
  def self.make(count)
    pow_set = Set.new

    (0...count).each do |pow|
      pow_set.add(2 ** pow)
    end

    pow_set
  end
end

class Tester
  attr_accessor :pow_arr, :pow_set, :run_count, :size, :max

  def initialize(run_count, size = 32)
    @size = size
    @run_count = run_count
    @pow_arr = TwoPowArray.make(size).shuffle
    @pow_set = TwoPowSet.make(size)
    @max = 2 ** size
  end

  def benchmark(structure)
    start_time = Time.now
    run_count.times { structure.include?(max + 1) }
    Time.now - start_time
  end

  def race
    array_time = benchmark(pow_arr)
    set_time = benchmark(pow_set)
    [array_time, set_time]
  end
end

t = Tester.new(1_000_000)

puts t.race
