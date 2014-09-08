def to_binary_u(n, fit=8)
  bin = ""
  while n > 0
    bin = (n % 2).to_s + bin
    n /= 2
  end

  return bin.rjust(fit, '0')
end