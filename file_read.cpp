#include<Rcpp.h>
#include<stdio.h>
#include<stdlib.h>
#include"file_size.h"

using namespace std;
using namespace Rcpp;

//[[Rcpp::export]]
String file_read(String args){
  std::string fn = args;
  size_t fs = file_size(fn.c_str()); // get file size
  size_t bs = (fs + 1) * sizeof(char); // buffer size to allocate
  char * s = (char *) (void *) malloc(bs); // allocate buffer
  memset(s, '\0', bs); // touch buffer area with null, auto null-terminated

  FILE * f = fopen(fn.c_str(), "rb"); // read file
  size_t n_r = fread(s, fs, sizeof(char), f);
  fclose(f);

  // remove trailing delimiter(s) if present
  if(s[bs-2] == '\n') s[bs-2] = '\0';
  if(s[bs-3] == '\r') s[bs-3] = '\0';

  return String(s); // convert c string to r-native object
}
