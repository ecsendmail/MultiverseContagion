# install package defaulting to rstudio server if need be 
install_package<-function(x){
  if(x %in% rownames(installed.packages()) == FALSE){
    result = tryCatch({
      install.packages(x)
    }, warning = function(warning_condition) {
      # warning-handler-code
    }, error = function(error_condition) {
      install.packages(x, repo="http://cran.rstudio.com/")
    }, finally={
      # cleanup-code
    })
  }
  else{
    cat("Already installed: ", x, "\n")
  } 
}

# set up dependencies
install_package("V8")
install_package("Rcpp")
install_package("parallel")
