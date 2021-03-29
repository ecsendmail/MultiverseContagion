This is a new version of the old BUI CovidSIMVL

Major difference 
1. The first prompt asks for population number and number of universes
2. The network-flow visualization works with the specified number of universes
3. The input files are expected in .csv format, and the whole node.js and JSON conversions 
   can be avoided.
   
Thus, this version is in a sense ideal for prototyping, because of the handy use of .csv files
and alerts, etc in the user environment.

The graphs are visualizable here, the program can be run in auto or manual mode, so the variables
can be inspected at any time.

However, the program is not set to just turn the use_html off....because the file code and
initialization sequences are not structured such that they both exist as functional code.

Rather, in this version, the JSON file and initialziation code have been commented out....

So, the total integration version will no doubt appear in the course of time......
For now, we have two variants:

This, the "new" GUI-html-csv version
and the "new" no-GUI-no-HTML version which was published a few days ago.


When creating the parameterized, no-GUI version, I had to put a lot of initialization
routines into functions, away from the main context....to explain in a few lines,
the javasccript program can be considered to be:

an OCEAN in which functions are declared and float around...
the OCEAN contains the immediate instructions that call the functions
since this is Javascript, intended for use with html and browsers, when
the OCEAN's own instructions have been executed, the program sits and waits
for the user's input from buttons, or forms that have been opened waiting for input, etc...

SO, program is;   OCEAN with code and data, calling functions declared and floating on the OCEAN

The difficulty is that to parameterize, and not to have any GUI, one could either:
	- hard code the parameters into the OCEAN-code
	- read it in from a file
	
With a GUI, one would issue a prompt, asking for some key parameters (like population)....
The program does not know how large arrays have to be - how many in the population, how many
Universes, how may initial cases, without the parameters being set...

So the no-GUI version depends on parameter file to be read in, which means that
to cross the domain between the program as client (remember, JS ia a browser environment), and
the file on the server, the node.js environment and JSON files have to be used....

So the first thing in the OCEAN is to call a function which reads in the parameter file and
invokes JSON etc....

The parameter files contain the names of the population.json and cases.json files, as well as other
program parameters...

So the JSON version of CovidSIMVL was restructured from the GUI-html version so that no data structures
are created or initialized in the OCEAN code, while all global variables are....

This is in essence a clean-up, because the sequence of initializations and dependencies were
exhaustively considered in rewriting for the JSON version. 

For example, the creation and initialization of charts were taken from the OCEAN and put into 
a function, which was called or executed if the variable use_html had been set to TRUE.

Similarly, code for HTML and for GUI (like console.log, alert, document.getElementById....) were
recoded by using a proxy function which then issued only in one place in the program the actual call.

So this version if one which had to comment out the JSON file code, with its approach to creating
universes, patients, tickets, stops and instead go back to the windows file prompt.

The windows file prompt is done through an HTML <div input= > where the display of this is
either "NONE" or "BLOCK" and when revealed, throws up the windows file input box which allows
the user to browse directories for the file (whereas the JSON version needs the file in the
same directory as the program)....

Thus, the initializations have to be ordered such that data referring to universe entries like counts from
the population happen after the universes have been created, etc...

This version is now more powerful than the previous GUI-html version, in that:

1. The number of universes is read in the initial prompt
2. The code for the net-graph visualization can accommodate a smaller number of universes thatn NINE.
3. The parameter parsing functions can be used in the GUI-html version.

So a new GUI_html version might have an additional parameter file (the ohter input files have to be
read in through the windows box, which does not violate the CORS domain boundary.

However, some additional designs or approaches that could be used:


1. A single parameter/data file, which could be constructed separately but glued together during construction,
which will have in the first column P for parameter, A for agent, and C for cases....
2. The parameters can set any of the variables, including the number of agents, number of cases, etc
3. The Population and Case files could be self-describing in terms of numbers, so the initial prompts
   may be removed from the program
4. 



