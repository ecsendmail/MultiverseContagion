#include<stdio.h>
#include<stdlib.h>
using namespace std;

size_t file_size(const char * fn){
  FILE * f = fopen(fn, "rb");
  if(!f){
    printf("Error: failed to open file: %s\n", fn);
    exit(1);
  }
  fseek(f, 0L, SEEK_END);
  size_t s = ftell(f);
  fclose(f);
  return s;
}
