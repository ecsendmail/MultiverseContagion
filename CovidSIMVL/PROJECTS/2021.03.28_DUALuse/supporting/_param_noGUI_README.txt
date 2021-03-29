 README - parameterized NO GUI CovidSIMVL 
 
 2021.03.21

This version for Windows10 uses a parameter file to set population, Hazard Radius, mingleFactor etc. but runs
without any GUI controls. Its index.html is called noGUI_index.html and has no significant displays. Warning:
the code for this version contains calls to html <div> entities which will fail if the switch

		use_html is set to TRUE at the start of the body of code!!
		
One would then have to use the standard index.html etc.....

As in the param-GUI version, the console.log is the main tool for  producing
output.

Both programs, within Windows and the Internet framework, depends on using JSON and node.js to cross internet
boundaries so that a file on the browser client side can read a file on the server side.

So the files node_start.bat, etc have to be in the working directory.

The json files have to be created for the parameter, population and client files through the html programs

				CSVtoJSON.html
				
As this is a browser program, the file that is created (the user is asked to name it [your choice.json], but it
is always saved in the download directory.

You have to go there, copy it and rename it as you wish.

The parameter file has to be called param.json, otherwise it has to be named by the user which defeats the
purpose of auto_naming.

It can specify the names of the population files.

The programs terminate either on a STOP parameter with a generation count, or else when there are no more
infectives (yellow, blue, or reds) in the Multiverse.

READ THE ACCOMPANYING DOCUMENT "Parameterized CovidSIMVL.docx" in this directory to see the format of the parameter
file, and some of the programming that enables parameters and independence of html references.

