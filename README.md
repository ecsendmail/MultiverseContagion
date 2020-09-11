## Quick Start
1. click on https://ecsendmail.github.io/MultiverseContagion/
2. OR clone repo, and open index.html in your browser e.g. firefox, chrome, etc.
3. enter global population size: 100, then press OK
4. CSV File: press Browse.. button and select data/Population.csv **prescribed agents' traffic pattern: movement between universes**
5. press CASES button and click on CSV File: press Browse.. and select data/VL1.csv **prescribed initial cases + viral load for agents**
6. press yellow "Auto" button to start the simulation
7. press "MV toggle" button to see info on the MultiVerse

## More information
The Handbook has all the information needed to run and understand the goals of CovidSIMVL.html
The version in this github is 2020.08.267MVL1508cM3R12.html
This needs to be run with the csv files 2020.08.23HundredMingl3OneU.csv and VLone.scv in that order
At first, you need to enter the number of persons (agents) which in this case is 100
The control files are set up just for one universe. 
A different scenario for schools involving 6 Universes will be uploaded within a week
The system starts up. after the files are loaded in Single Universe mode
The LOAD button must be pressed after the files are loaded to get going.

Use the HF++ button to go an hour at a time.

The use of AUTO will keep going, hour by hour
Pressing the AUTO button again will put the system back into manual mode.

The Multiverse can be invoked by double-clicking the MV button (top left)....

## Quick Start: run simulation in R (tested on ubuntu)
1. run:

sudo ./setup.sh

2 run:

Rscript run.R
