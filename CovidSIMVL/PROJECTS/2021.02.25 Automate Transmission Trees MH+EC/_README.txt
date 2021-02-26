2021.02.25 New Project with Mahdi as lead and EC support

The purpose is to automate the conversion from console.log to transmission trees
This will take a number of steps, some in excel to begin with

1. Run an instance of CovidSIMVL
2. Trun on or obtain console.log in text form
3. Filter out information pertaining to the run, and to other information like state structures in console.log
4. Now we are left with the 
      who infects who in what universe at what generation
5. From this break out the fields from the string (one string per line)
6. Using the fields, and sort functions, start building the path trees
7. Compute Q-values and other asymmetry metrics from the path tree
8. Visualize the path tree
      - initially descendants of one node are on same level
	  - eventually, we need to represent the time at which the descendeant was created along the absolute time line
	  - at some point, we also need to represent where (what Universe) the descendants were created
9. If we can animate the creation, we can play and replay the tree as it was being created, in time and space (Universe)
10 Perhaps we can also see the agent influences since the dependencies follow the transmission paths

In the PRIMARY directory, the most recent "bug-free" CovidSIMVL and its index.html is present, together with 
a population file of 100 persons, and a CASE file of one infective.

This file has no age structure - they are all in ageGp 0 (blank actually in the csv file)
A representative output in Excel is also present.

The simplest way to get the console.log out at present is the following:

1. Run CovidSIMVL in Microsoft Edge by right-click on index.html and selecting Edge 
       macOS users might try selecting Safari
2. When running CovidSIMVL, right click anywhere in the execution frame, and select "INSPECT" to bring up devtools
3. In devtools, select "CONSOLE"
   This will display the console.log as the program runs
4. At the end of the run, right click on the console.log area (entries) and save as to its named file and directory
5. If you just save, a file called "_xxxxxxxxx.log" is created usually in the system "downloads" directory
6. Open in Notepad++ or a simple text editor, select all, and paste into Excel....

Cut and paste the screen to store other information as you wish...