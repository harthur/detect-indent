# Gonzalo Ciruelos
# Problem A


def intersection(set1, set2):
	for a in set1:
		if a in set2:
			yield a

f = open('A-small-attempt0.in', 'r')
case_no = 1
for game in range(int(f.readline())):

	square1 = [0,0,0,0]
	guess1 = int(f.readline()[0])
	square1[0] = f.readline()[:-1].split(' ')
	square1[1] = f.readline()[:-1].split(' ')
	square1[2] = f.readline()[:-1].split(' ')
	square1[3] = f.readline()[:-1].split(' ')
	
	
	square2 = [0,0,0,0]
	guess2 = int(f.readline()[0])
	square2[0] = f.readline()[:-1].split(' ')
	square2[1] = f.readline()[:-1].split(' ')
	square2[2] = f.readline()[:-1].split(' ')
	square2[3] = f.readline()[:-1].split(' ')
	
	both = list(intersection(square1[guess1-1],square2[guess2-1]))
	
	if len(both)==1:
		result = both[0]
	elif len(both)>1:
		result = 'Bad magician!'
	else:
		result = 'Volunteer cheated!'
	
	
	print 'Case #'+str(case_no)+': '+result
	
	case_no+=1