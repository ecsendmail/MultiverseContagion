This project, called "REACTION CHAMBER" is better renamed as "Stochastic buffer"

The idea here is to demosntrate that sotahstic and random can affect outcomes very significantly
We pose two identical set of Universes
Each set has 3 connected Universes, all with the same parameters (in both sets)
The first is the Generator
The second is the Buffer
The third is the Canary

Each of the 5 has a population of 100
Each day, travellers from Generator go to Buffer and stay from 1200 to 1800hours
Each day, travellers from Buffer to to Canary for the same period of time

Initial conditions: 4 infected in each Generator; Buffer and Canary initially uninfected
Travel: from Generator to Buffer: two infected go, two stay, and in addtion, eight others
        initially uninfected, go to buffer
Travel from buffer to Canary three each day (pre-selected at random)

Expected behavior:
The infection and spread in the Canary universes depend on the three becoming
infected within the Buffers...and this is a stochastic (or is it random?)

The dynamics in the Generator and Buffer is progressive:
    - each cycle, the two initial infected in Generator that stay behind can infect the  
      rest of the agents in the Generator
	- when the 10 that go to Buffer come back, there are 16 hours each day for the 8 initially
	  uninfected to become infected within the Generator
	- thus, the number of infected going to the buffer increases with time
	  and the number of infected in the Buffers will increase with time
	- however, a specific three have to become infected for Canary to get an
	  infected agent, that stays only for 6 hours a day
	- it would be surprising if the two Canaries receive infected persons that
	  trigger a local spread at the same time
	 
Experimental observations to date:
	- under particle conditions (out of box settings HzR=5, mF=1, ClinialDays=13.2
	  we get similar behaviors for both Canaries
	- under WAVE conditions, we can get severely divergent epidemics
	
We can now set mF for different Universes; the ClincalDays is still a global setting; HzR can be
changed through a parameter SizeFactor in the parameter file ONLY...

Nevertheless, if in the generator Universe, we set mF low to decrease the likelihood of the 3 agents that
go to Canary, say to 0.3, and then set Canary mF to 4 so that an infective agent will cause a secondary
(increase its sensitivity), we can look at different scenarios.

The console.log shows the infections.
We can turn on a capability that shows the structure (G:Y:B:R:O) at each Universe in each generation
to get a detailed view of the dynamics
The console.log also shows the transmission trees either globally or for each Universe....


So this is a sandbox that shows the outcome effects as a function of the stochastic buffer.
The overall epidemic daily count of REDS show multiple peaks.....in the attached spreadsheet

This is intriguing as it suggests that surges may be simply the result of stochastic behavior, and
not to behavioral causes (unless behavior is equivalent to stochastic steps)...and that the same
conditions can result in remarkably different experiences in Observer Universes....

