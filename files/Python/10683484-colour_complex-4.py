from itertools import cycle
colours = cycle(['Dark','Light'])

def get_color_complex():
    i = 0
    dct = {'Light': [], 'Dark': []}
    while i<64:
        if colours.next() == 'Light':
            dct['Light'].append(i)
        else:
            dct['Dark'].append(i)
        i +=1
    return dct


    
    
