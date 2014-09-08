def capicua(numero):
    numero = str(numero)
    if numero == '' or len(numero) == 1:
        return True
    elif numero[0] == numero[-1]:
        return capicua(numero[1:-1])
    return False

print capicua(123321)
