f = open('codes.txt')
for line in f:
    code = line.strip()
    print "'("+code+")',",

f.close()