import numbers

i = '12345ab'

for x in i:
	if isinstance(int(x), numbers.Number):
		print x
	else:
		print 'no'