# A sample class in Ruby. While constructing this class, we started with the desired behaviors 
# By knowing the behavior we wanted, we were able to come up with the states to initialize. 

class Rectangle
  def initialize(length, breadth)
    @length = length
    @breadth = breadth
  end

  def perimeter
    2 * (@length + @breadth)
  end

  def area 
    @length * @breadth
  end 
end