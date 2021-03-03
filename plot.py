import os
import sys
import numpy as np
import matplotlib.pyplot as plt

d = {}
max_N = 0
files = [x.strip() for x in os.popen("ls -1 count*.csv").readlines()]
print(len(files), "number of files")
for f in files:
    lines = [x.strip() for x in open(f).readlines()]
    exp = '"","green","yellow","blue","red","orange"'
    
    if lines[0] != exp:
        print("Error: expected: " + exp)
        sys.exit(1)

    data = []    
    for i in range(len(lines)):
        w = lines[i].strip().split(',')
        w = [x.strip('"') for x in w]
        if i > 0:
            w = [int(x) for x in w]
        data.append(w)

    N = len(data) - 1
    if N > max_N:
        max_N = N 
    d[f] = data

value = [np.zeros(max_N) for i in range(5)]
print(value)

print('max_N', max_N)

ci = 1
for f in files:
    print(ci, f)
    ci += 1
    data = d[f]
    for i in range(len(data) - 1):
        w = data[i + 1]
        j = w[0] - 1
        w = w[1:]
        for k in range(len(w)):
            value[k][j] += w[k]

N = float(len(files))
print("N", N)
lab = ["green","yellow","blue","red","orange"]
for k in range(len(value)):
    plt.plot(value[k] / N, color=lab[k], label=lab[k])
plt.legend()
plt.title("average count per state over " + str(int(N)) + "simulations")
plt.tight_layout()
plt.show()

'''
"","green","yellow","blue","red","orange"
"1",100,0,0,0,0
"2",100,0,0,0,0
"3",96,0,4,0,0
"4",95,0,5,0,0
"5",95,0,5,0,0
"6",95,0,5,0,0
"7",95,0,5,0,0
"8",95,0,5,0,0
"9",95,0,5,0,0
'''

# next: add error bars re: standard deviation?
