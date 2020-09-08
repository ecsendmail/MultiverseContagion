#include<Rcpp.h>
#include<string>
#include<sstream>
#include<stdio.h>
#include<stdlib.h>

using namespace std;
using namespace Rcpp;

//[[Rcpp::export]]
int max_pid(String s){
  int max_j = 0;
  size_t ci = 0;
  std::string token;
  std::istringstream iss(s);
  
  while(getline(iss,token)){  
    const char * ss = token.c_str();
    size_t nb = strlen(ss) + 1;
    char * ts = (char *)(void *) malloc(nb);
    memset(ts, '\0', nb);
    
    for(size_t i = 0; i < nb - 1; i++){
      ts[i] = ss[i];
    }
    
    if(ci++ > 0){
      char * token2 = strtok(ts, ",");
      int j = atoi(token2);
      if(j > max_j) max_j = j;
    }
  }
  return max_j;
}
