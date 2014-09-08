## open class

    class Array
      def second_last
        self[-2]
      end
    end

    class Array
      def first
        self[1]
      end
    end

    class ActiveRecord::Base
      def all
        raise "Don't use this!"
      end
    end


## meta-programming: Method#source_location

    ActiveRecord::Base.method(:find).source_location

## meta-programming: Class#methods

    Array.methods   
      => [:[], :try_convert, :allocate, :new, :superclass, :freeze, :===, :==, :<=>, :<, :<=, :>, :>=, :to_s, :inspect, :included_modules, :include?, :name, :ancestors, :instance_methods, :public_instance_methods, :protected_instance_methods, :private_instance_methods, :constants, :const_get, :const_set, :const_defined?, :const_missing, :class_variables, :remove_class_variable, :class_variable_get, :class_variable_set, :class_variable_defined?, :public_constant, :private_constant, :module_exec, :class_exec, :module_eval, :class_eval, :method_defined?, :public_method_defined?, :private_method_defined?, :protected_method_defined?, :public_class_method, :private_class_method, :autoload, :autoload?, :instance_method, :public_instance_method, :nil?, :=~, :!~, :eql?, :hash, :class, :singleton_class, :clone, :dup, :taint, :tainted?, :untaint, :untrust, :untrusted?, :trust, :frozen?, :methods, :singleton_methods, :protected_methods, :private_methods, :public_methods, :instance_variables, :instance_variable_get, :instance_variable_set, :instance_variable_defined?, :remove_instance_variable, :instance_of?, :kind_of?, :is_a?, :tap, :send, :public_send, :respond_to?, :extend, :display, :method, :public_method, :define_singleton_method, :object_id, :to_enum, :enum_for, :equal?, :!, :!=, :instance_eval, :instance_exec, :__send__, :__id__]    

## range objects

    10..50
    (10..50).include? 25

## spaceship operator

    2 <=> 5       # => -1
    5 <=> 2       # =>  1
    2 <=> 5       # =>  0

    arr = [15, 2, 25, 80, 32, -10]
    arr.sort                         #=> [-10, 2, 15, 25, 32, 80]
    arr.sort{|x,y| x*x <=> y*y }     #=> [2, -10, 15, 25, 32, 80]

    class User
      # properties: id, maths_marks, english_marks
    end
    users = User.all
    user.sort{|x,y| x.maths_marks <=> y.maths_marks }


## number overflow

    i = 32000        #=> 32000
    i += 1000        #=> 33000
    i += 10000       #=> 43000
    i += 100000      #=> 143000 
    i += 1000000     #=> 1143000

    i += 1000000000000000   #=> 1111111111143000


## upto and downto

    2.upto(n-1) do |i|
      n%i == 0
    end

    (n-1).downto(0) do |i|
      n%i == 0
    end

## the map &:to_i pattern

    numbers_s = line.split(',')
    numbers = numbers_s.map(&:to_i)
    sum_of_numbers(numbers)


## methods without parenthesis

    sqrt_of(average_of(sum_of(numbers)))
    sqrt_of average_of sum_of numbers


    ((le-20)/(82.3-20) * (mysi*eysi)**(0.5) * Math.log(gni)-(4.605)/6.982) ) ** 0.33

    (
     (le-20) / (82.3-20) *            # life-expectency
     (mysi*eysi) ** (0.5) *           # education index
     (Math.log(gni)-4.605)/6.982      # income index
    ) ** 0.33

    (life_expectency() * education_index() * income_index()) ** 0.33

    (life_expectency * education_index * income_index) ** 0.33

## methods ending in =

    def foo=(x)
      @num=x
    end

    class User
      def english_marks=(m)
        self.em = m
        recalculate_average
      end
    end


## Array.shuffle

    arr.shuffle          #=> Random order
    arr.shuffle.first    #=> Gets a random element from the array


## Array.permutation

    a = [1, 2, 3]
    a.permutation(2).to_a #=> [[1,2],[1,3],[2,1],[2,3],[3,1],[3,2]]
    a.permutation.to_a    #=> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

## Array.product

    [1,2,3].product([4,5])       #=> [[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]]
    [:a,:b,:c].product([1,2,3])  #=> [[:a, 1], [:a, 2], [:a, 3], [:b, 1], [:b, 2], [:b, 3], 
                                 #=>  [:c, 1], [:c, 2], [:c, 3]]

## Array negative indexes
   
    a = [1,2,3]
    a[-1]         #=> 3

## Array flatten/compact/uniq

    a = [[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]]
    a.flatten                                   #=> [1, 4, 1, 5, 2, 4, 2, 5, 3, 4, 3, 5]
    a.flatten.uniq                              #=> [1, 4, 5, 2, 3]
    a1 << nil; a1.compact                       #=> [1, 4, 5, 2, 3]


    a.uniq{|x| x[1]}                            #=> [[1, 4], [1, 5]]
    users.uniq{|u| u.date_of_birth }


## Date/Time parsing in ActiveSupport

    require 'date'
    d  = Date.parse "2 Feb 2014"


    require 'active_support'
    require 'active_support/core_ext/numeric/time.rb'
    require 'active_support/core_ext/date/calculations.rb'
    #
    d1 = d - 10.days
    d2 = d - 4.months
    d3 = 3.weeks.ago


## surround code with blocks


    def first_step
      log(:start, :s1)
      do_step1
      log(:end, :s1)
    end
    #
    def second_step
      log(:start, :s2)
      do_step1
      log(:end, :s2)
    end
    #
    def third_step
      log(:start, :s3)
      do_step1
        log(:end, :s3)
    end

can become

    def first_step
      with_logging{ do_step1 }
    end
    #
    def second_step
      with_logging{ do_step2 }
    end
    #
    def third_step
      with_logging{ do_step3 }
    end
    #
    #
    def with_logging
      log(:starting)
      yield
      log(:ending)
    end
