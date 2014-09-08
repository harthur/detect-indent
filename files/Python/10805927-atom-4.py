class atom(object):
    """An implementation of the atom concept, inspired by Erlang.
    
    Modified from here: http://www.me.net.nz/blog/atoms-slash-symbols-in-python/
    
    """
    def __init__(self, a):
        self._a = intern(a)
    
    def __eq__(self, other):
        if isinstance(other, atom):
            return other._a == self._a
        else:
            return other == self._a
    
    def __ne__(self, another_atom):
        return not self.__eq__(another_atom)
    
    def __repr__(self):
        return 'atom: ' + self._a
    
    def __hash__(self):
        return hash(self._a)