# run R simulation wrapper, in parallel
import os
import sys

def run(c):
    a = os.system(c)

# make sure the compiled code is ready
run("Rscript run.R 1")

N_SIMULATIONS = 10
CPU_COUNT = os.cpu_count()

f = open('run.sh', 'wb')
for i in range(N_SIMULATIONS):
    f.write(('Rscript run.R ' + str(i + 1) + ' > log_' + str(i + 1) + '.txt 2>&1 &\n').encode())
    if (i + 1) % CPU_COUNT == 0:
        f.write('wait\n'.encode())
f.close()

run('chmod 755 run.sh')
run('./run.sh')
