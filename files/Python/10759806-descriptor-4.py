"""
Call Descriptor
~~~~~~~~~~~~~~~

Allows you to dynamically modify an instance's __call__ value.
You may be asking, why not just use an attribute on the object
instead of this magical descriptor?

Good fucking question...

"""

class CallDescriptor(object):

    def __get__(self, obj, objtype):
        return obj.__call__

    def __set__(self, obj, val):
        self.__delete__(obj)
        NewClass = type(
            "Callable"+obj.__class__.__name__,
            (obj.__class__,),
            {'__call__': val}
        )
        obj.__class__ = NewClass

    def __delete__(self, obj):
        if callable(obj):
            obj.__class__ = obj.__class__.__bases__[0]