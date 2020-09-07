# todo: still need to assert delimiter is /r/n or replace delimiter

# simulation parameters
csv_traffic_file <- "data/MVDATAge.csv";
csv_cases_file <- "data/VL1.csv";

library(Rcpp)

src<-function(x){
  cat(paste("src(", x, ")\n", sep=""))
  Rcpp::sourceCpp(x, cacheDir='tmp') ## source c/c++ fxn
}

src("file_read.cpp") # read file
src("max_pid.cpp") # find max pID in csv

csv_traffic<-file_read(csv_traffic_file) # read traffic file
print(csv_traffic)
csv_cases<-file_read(csv_cases_file); # read cases file
print(csv_cases)

number_of_agents <- max_pid(csv_traffic) + 1 # determine the number of agents

library(V8)
ctx <- v8()

# pass both CSV data files contents into JS
ctx$assign("csv_traffic", csv_traffic) # raw data from traffic plan / tickets file
ctx$assign("csv_cases", csv_cases) # raw data from cases / viral load file
ctx$assign("number_of_agents", number_of_agents); # number of agents

# set up the simulation
ctx$source("simulation.js")

# todo: run the simulation

# todo: extract state space data
