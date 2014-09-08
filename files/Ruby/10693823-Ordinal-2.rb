# encoding: utf-8
# authors: jason liu and thomas weng

# NORMAL
class Normal
  attr_accessor :result

  def num_ord(n)
    if (n.is_a? String) || n.nil? || Integer(n) != n || n <= 0
      @result = nil
    elsif n > 10 && n < 20
      @result = n.to_s + 'th'
    elsif n % 10 == 1 || n % 10 == 2 || n % 10 == 3
      @result = n.to_s + %w(st nd rd)[n % 10 - 1]
    else
      @result = n.to_s + 'th'
    end
  end
end

describe Normal do
  normal = Normal.new

  it 'returns the ordinal number' do
    inputs = [8, 11, 12, 13, 14, 41, 82]
    results = %w(8th 11th 12th 13th 14th 41st 82nd)

    inputs.each do |x|
      normal.num_ord(x)
      normal.result.should eq(results[inputs.find_index(x)])
    end
  end

  it 'should give a noninteger error' do
    inputs = [-1, 3.2, '0x1a', 'test', nil, '']

    inputs.each do |x|
      normal.num_ord(x)
      normal.result.should eq(nil)
    end
  end
end
