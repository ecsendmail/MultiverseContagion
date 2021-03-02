import os
import sys
import numpy as np
import matplotlib.pyplot as plt

d = {}
files = [x.strip() for x in os.popen("ls -1 count*.csv").readlines()]
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
    d[f] = data


