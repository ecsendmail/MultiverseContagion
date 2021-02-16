#!/usr/bin/env bash
# install dev. lib. for v8, whereas libnode-dev is a dependency
sudo apt install libv8-dev libnode-dev

# only attempt to install R if it's not already installed
a="which R";
b=$(eval $a)
c="/usr/bin/R";
if [ "$b" == "$c" ]; then 
	echo "R already installed"
else
	echo "installing R.."
	sudo apt install r-base
fi

sudo Rscript setup.R
