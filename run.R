args = commandArgs(trailingOnly=TRUE)

# library(parallel) # parallelism
library(Rcpp) # run C++ code within R
library(V8) # run v8 JS interpreter in R

# simulation parameters ###############################
csv_traffic_file <- "./CovidSIMVL/Simulation Engines/PRIMARY CovidSIMVL/2021.02.15 AgeGpPop1000MVLTC.csv"
csv_cases_file <- "./CovidSIMVL/Simulation Engines/PRIMARY CovidSIMVL/2021.02.15 VLfive.csv"

# physical parameters
HAZARD_RADIUS <- 5 # hazard radius
MINGLE_FACTOR <- 1. # mingle factor

# temporal parameters
INCUBATING <- 2.2 # longditudinal value (days): incubating from 0 to INCUBATING
PRESYMPTOMATIC <- 5.2 # longditudinal value (days): presymptomatic from INCUBATING to PRESYMPTOMATIC
SYMPTOMATIC_CASES <- 13.0 # longditudinal value (days): symptomatic from PRESYMPTOMATIC to SYMPTOMATIC_CASES

# meta parameters
MIN_ITERATIONS <- 2000 # minimum number of steps per trial
MAX_ITERATIONS <- 2000 # maximum number of steps per trial

# end simulation parameters ###########################

src<-function(x){
  cat(paste(x, "\n", sep=""))
  Rcpp::sourceCpp(x, cacheDir='tmp') ## source c/c++ fxn
}

src("cpp/file_read.cpp") # read file
src("cpp/max_pid.cpp") # find max pID in csv

csv_traffic<-file_read(csv_traffic_file); # print(csv_traffic); # read traffic file
csv_cases<-file_read(csv_cases_file); # print(csv_cases); # read cases file
number_of_agents <- max_pid(csv_traffic) + 1 # determine the number of agents
cat(paste("n_agents,", number_of_agents, "\n", sep="")) # print out number of agents

ctx <- v8() # create v8 instance: javascript interpreter within R

# pass both CSV data files contents, plus number of agents, into JS
ctx$assign("csv_cases", csv_cases)
ctx$assign("csv_traffic", csv_traffic)
ctx$assign("number_of_agents", number_of_agents)

# pass parameters into simulation
ctx$assign("HAZARD_RADIUS", HAZARD_RADIUS)
ctx$assign("MINGLE_FACTOR", MINGLE_FACTOR)

ctx$assign("SYMPTOMATIC_CASES", SYMPTOMATIC_CASES)
ctx$assign("PRESYMPTOMATIC", PRESYMPTOMATIC)
ctx$assign("INCUBATING", INCUBATING)

ctx$assign("MIN_ITERATIONS", MIN_ITERATIONS)
ctx$assign("MAX_ITERATIONS", MAX_ITERATIONS)

# set up and run the simulation
ctx$source("./CovidSIMVL/Simulation Engines/PRIMARY CovidSIMVL/CovidSIMVLvax.js")

# extract state space data
state_names <- ctx$get("state_names")
state_counts <- ctx$get("state_counts")
colnames(state_counts) <- state_names # give the matrix column names

csv_fn <- paste("counts_", args[1], ".csv", sep="")
write.csv(state_counts, csv_fn)

if(length(args)==0){
  pdf("counts.pdf")
  matplot(state_counts,
    xlim = c(0, nrow(state_counts)),
    ylim = c(0, max(state_counts)),
    type="l",
    lwd = 1,
    lty="solid",
    xlab="iteration",
    ylab="count",
    main="Individuals per state, per iteration",
    col = state_names)

  legend("topright", legend= state_names, col=state_names) #, lty=1:5)
  dev.off()
  cat("output written to counts.pdf\n")
}
