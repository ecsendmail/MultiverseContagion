# edited this to add resilience. Should be able to clean this up better
if("V8" %in% rownames(installed.packages()) == FALSE){
  result = tryCatch({
    install.packages("V8")
  }, warning = function(warning_condition) {
    # warning-handler-code
  }, error = function(error_condition) {
    install.packages("V8", repo="http://cran.rstudio.com/")
  }, finally={
    # cleanup-code
  })
}

if("Rcpp" %in% rownames(installed.packages()) == FALSE){
  result = tryCatch({
    install.packages("Rcpp")
  }, warning = function(warning_condition) {
    #warning-handler-code
  }, error = function(error_condition) {
   install.packages("Rcpp", repo="http://cran.rstudio.com/")
  }, finally={
    #cleanup-code
  })
}
