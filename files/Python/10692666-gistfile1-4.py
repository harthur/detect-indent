class Ball(object):
    def __init__(self, size, color):
        self.size = size
        self.color = color
        self.shape = 'spherical'
        
class ImaginaryBallCreature(Ball):
    def __init__(self, size, color, requires_brushing, has_been_photographed):
        Ball.__init__(self, size, color)
        self.is_imaginary = True
        self.requires_brushing = requires_brushing
        self.has_been_photographed = has_been_photographed    

class Braveison(ImaginaryBallCreature):
    def __init__(self):
        ImaginaryBallCreature.__init__(self, 'humongous', 'pink', True, True)
        
class Brussia(ImaginaryBallCreature):
    def __init__(self):
        ImaginaryBallCreature.__init__(self, 'humongous', 'blue', True, False)
