def fibs(base)
  fib = Enumerator.new do |y|
    a = b = base
    loop do
      y.yield a
      a, b = b, a + b
    end
  end
  fib
end
p fibs(1).take(6)
p fibs(2).take(6)