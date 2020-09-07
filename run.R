# simulation parameters
csv_traffic <- "data/MVDATAge.csv";
csv_cases <- "data/VL1.csv";

library(Rcpp)

src<-function(x){
  cat(paste("src(", x, ")\n", sep=""))
  Rcpp::sourceCpp(x, cacheDir='tmp') ## source c/c++ fxn
}

src("file_read.cpp") # read file
dat<-file_read(csv_traffic); print(dat)
da2<-file_read(csv_cases); print(da2)

library(V8)
ctx <- v8()
ctx$source("simulation.js")
