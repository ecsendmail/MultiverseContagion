## Quick Start 2021.02.15   Feb 15, 2021

THIS SITE HAS BEEN COMPLETELY RESTRUCTURED.
EVERYTHING TO DO WITH CovidSIMVL has been uploaded - the early and intermediate constructions, the projects, the powerpoints
Consider most of them archives 
There are 3 top-level folders:
     a. Documents
     b. PROJECTS
     c. Simulation Engines
     
Within /Simulation Engines, the PRIMARY CovidSIMVL contains the:
     index.html
     the .js Javascript file
     the two CSV files - one defining the population, the other the cases
     and an Excel sheet containing the sample outputs pasted from the console.log and screen images
read the _README.txt in the folders where you find them, especially in /Simulation Engines

In the /documents folder, the /Hnadbook directory has many versions as they have evolved. The latest is
just up to September 2020. It is not current but will give you an overall guide to starting and using the
system....


The Handbook has information useful to run and understand the goals of CovidSIMVL.
The version in this github is 2020.09.10.

The use of AUTO will keep going, hour by hour
Pressing the AUTO button again will put the system back into manual mode.

The Multiverse can be invoked by double-clicking the MV button (top left)....
Within it is a button labeled "TRAFFIC". To get out of it you need to DOUBLE-CLICK the red "STOP/EXIT"

CAVEAT - as it sits, we assume you know something about browsers, devtools, console.logs, WATCH variables of
interest, and so on if you are intending to run or modify COvidSIMVL.

LICENSE - CovidSIMVL is in the public domain, and available for your download, use, modification and distribution under the terms of
the GNU License Open Software framework.

Many may just use the /Documents folder as a resource for information about this particular agent-based simulation space, and
the manuscripts, notes, and powerpoint presentations created around CovidSIMVL as tool and sandbox for exploration, and as an
instrument for the detailed study of contagion-based epidemics.



## Quick Start: run simulation in R (tested on ubuntu)
1. run:

```
sudo ./setup.sh
```

2 run:

```
Rscript run.R
```


<img src="./CovidSIMVL/Simulation Engines/PRIMARY CovidSIMVL/counts.png">
