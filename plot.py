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
            w = [int(x) for x in w] # read non-header row
            data.append(w)

    N = len(data)
    if N > max_N:
        max_N = N  # max number of iterations observed in batch 
    d[f] = data

value = [np.zeros(max_N) for i in range(5)] # average value 
lower = [sys.float_info.max * np.ones(max_N) for i in range(5)] # lower envelope
upper = [sys.float_info.min * np.ones(max_N) for i in range(5)] # upper envelope

print(value)

print('max_N', max_N)

ci = 1
for f in files:
    print(ci, f)
    ci += 1
    data = d[f]  # time series for this file
    for i in range(len(data)):
        w = data[i] # vector for a point in time
        j = w[0] - 1
        w = w[1:]
        for k in range(len(w)): # for each dimension of vector
            value[k][j] += w[k]
            
            if w[k] < lower[k][j]:
                lower[k][j] = w[k]
            if w[k] > upper[k][j]:
                upper[k][j] = w[k] 

N = float(len(files))
print("N", N)

plt.figure(figsize=(16, 12))
plt.rcParams['axes.facecolor'] = 'black'
lab = ["green","yellow","blue","red","orange"]
for k in range(len(value)):
    plt.plot(value[k] / N, color=lab[k], label=lab[k])
    plt.plot(lower[k], color=lab[k], ls='--')
    plt.plot(upper[k], color=lab[k], ls='--')

legend = plt.legend()
plt.setp(legend.get_texts(), color='w')
plt.title("avg counts / state: " + str(int(N)) + " runs")
plt.tight_layout()
plt.savefig("plot.png")

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
