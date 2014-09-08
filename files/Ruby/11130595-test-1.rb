```ruby
def set_and_return=val
 @test = val
 return 0
end

p set_and_return(1) #=> 1
p set_and_return("test") #=> "test"
```

Is there ANY way to make a ruby setter return something OTHER than the value you pass in? It seems to be a 
special case as soon as you put a = in the name!

