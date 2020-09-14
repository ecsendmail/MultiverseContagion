## Quick Start
1. click on https://ecsendmail.github.io/MultiverseContagion/
2. OR clone repo, and open index.html in your browser e.g. firefox, chrome, etc.
3. enter global population size: 100, then press OK

***** for the next part, you may need to download Population.csv and VLone.csv from /data to your local directory

4. CSV File: press Browse.. button and select data/Population.csv **prescribed agents' traffic pattern: movement between universes**
5. press CASES button and click on CSV File: press Browse.. and select data/VLone.csv **prescribed initial cases + viral load for agents**

      Select the file, click on it2. 
      In the next window, find the "raw" button and click on it3. 
      In the next window, right click to "save as...." into your local directory4. 
      Then use the files in your local directory in the instructions above
      
******

6. press yellow "Auto" button a couple of times to start the simulation
7. press "MV toggle" button to see info on the MultiVerse

## More information in DOC folder
The Handbook has all the information needed to run and understand the goals of CovidSIMVL.html
The version in this github is 2020.09.10MVL1510bfamKey1015.html
This needs to be run with the csv files Population.csv and VLone.scv in that order
At first, you need to enter the number of persons (agents) which in this case is 100
The Excel file Population.xlsx has the documentation describing the population structure 
The Technical Report #003 has more prose description.
The system starts up. after the files are loaded in Single Universe mode
The LOAD button must be pressed after the files are loaded to get going.

Use the HR++ button to go an hour at a time.

The use of AUTO will keep going, hour by hour
Pressing the AUTO button again will put the system back into manual mode.

The Multiverse can be invoked by double-clicking the MV button (top left)....

## Quick Start: run simulation in R (tested on ubuntu)
1. run:

sudo ./setup.sh

2 run:

Rscript run.R
