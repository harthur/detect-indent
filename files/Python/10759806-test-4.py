from descriptor import CallDescriptor

class A(object):
    call = CallDescriptor() # Must not be in instance
    
a = A()
print callable(a) # False
a.call = lambda self: "Hello world!"
print callable(a) # True
print a() # "Hello World!"

# Doesn't modify the original class
b = A()
print callable(b) # False