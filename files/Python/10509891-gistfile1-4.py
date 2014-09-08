problem = 'A-sample'

fin = open(problem + '.in')
fout = open(problem + '.out')

def read_ints():
    return [int(x) for x in fin.readline().strip().split()]

T = read_ints()
for caseno in range(T):
    pass
    fout.write("Case #%d: " + result + "\n")