class Cat
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def self.chorus(noise_method, *cats)
    cats.each do |cat|
      cat.make_noise(noise_method)
    end
  end

  def make_noise(noise_method)
    noise_method.bind(self).call
  end

  def meow
    puts "#{ name } meows"
  end

  def purr
    puts "#{ name} purrs"
  end
end

e = Cat.new('earl')
b = Cat.new('breakfast')

meow = Cat.instance_method(:meow)
purr = Cat.instance_method(:purr)

Cat.chorus(purr, e, b)
