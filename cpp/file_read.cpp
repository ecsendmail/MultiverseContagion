#include<Rcpp.h>
#include<stdio.h>
#include<stdlib.h>
#include"file_size.h"

using namespace std;
using namespace Rcpp;

void find_and_replace(std::string & data, std::string to_match, std::string to_replace){
    size_t pos = data.find(to_match); // get first occurrence; repeat to end
    while(pos != std::string::npos){
        data.replace(pos, to_match.size(), to_replace);  // replace occurrence of Sub String
        pos = data.find(to_match, pos + to_replace.size()); // get next occurrence from cur posn
    }
}

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
  
  string ret(s);
  // force delim to Windows as expected by Ernie's JS
  find_and_replace(ret, string("\r\n"), string("\n"));
  find_and_replace(ret, string("\n"), string("\r\n"));
  
  free(s);

  return String(ret); // convert c string to r-native object
}
