library(Rcpp) # run C++ code in R
library(V8) # run v8 JS interpreter in R

# simulation parameters
csv_traffic_file <- "data/MVDATAge.csv";
csv_cases_file <- "data/VL1.csv";

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
ctx$assign("number_of_agents", number_of_agents);

# set up the simulation
ctx$source("simulation.js")

# run simulation

# extract state space data
