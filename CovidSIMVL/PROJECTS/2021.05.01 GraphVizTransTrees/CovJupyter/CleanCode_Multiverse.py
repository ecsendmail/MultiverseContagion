#!/usr/bin/env python
# coding: utf-8

# # Loading Required Packages

# In[1]:


import pandas as pd
import numpy as np
import sys
import pydot
from graphviz import Digraph


# # Loading the csv file and sort it based on the gen

# In[2]:


data = pd.read_csv('multiverse-m.csv')
idx,idy = data.shape
print(data)
df1 = data.sort_values(by=['gen'],ignore_index=False)
m = max(data['Biter'].max(), data['victim'].max())
print(data)
# print(data1)
U = np.array(range(0,m+1))
for i in range(0,m+1):
    U[i] = -1
df1.to_csv("ordered_multiverse.csv",index=False)


# ## Create the first intial graph with all the nodes and no edges
# 

# In[3]:


from graphviz import Digraph
import graphviz
from subprocess import check_call
gra = Digraph()
e = []
i=0
data = pd.read_csv("ordered_multiverse.csv")
while(i < idx):
    source = data['Biter'][i]
    target = data['victim'][i]
    gra.node(str(source),color='grey',style='filled')
    gra.node(str(target),color='grey',style='filled')
    gra.edge(str(source), str(target),color='white')
    i +=1
    if (i > 500):
        break
gra.render(filename='multiverse/_1.dot')
path = "multiverse/_1.dot"
output = "multiverse/_1" + ".png"
check_call(['dot','-Tpng',path,'-o',output])


# # add each edge at a time and save it into memory

# In[4]:


import graphviz
from subprocess import check_call

colors = ["salmon","cyan", "orange", "bisque4", "yellow", "khaki","purple","green","red" ]
i=0
while(i <= 343):
    source = data['Biter'][i]
    target = data['victim'][i]
    gen = data['gen'][i]
    U = data['U'][i]
    gra.node(str(source),color=colors[U],style='filled')
    gra.node(str(target),color=colors[U],style='filled')
    gra.edge(str(source), str(target),color='red',label=str(gen))
    path = "multiverse/" + str(i) + ".dot"
    gra.render(filename=path)
    output = path + ".png"
    check_call(['dot','-Tpng',path,'-o',output])
    gra.edge(str(source), str(target),color='white')
    i +=1
    if (i >= 501):
        break


# # Put them all together and create the avi file

# In[6]:


import cv2
import numpy as np
import glob
img_array = []
imgs = glob.glob("multiverse/*.png")
path = "multiverse/"
for i in range(0,343):
    input1 = path+str(i) +".dot" + ".png"
    img = cv2.imread(input1)
    if (i==0): 
        height, width, layers = img.shape
    resized = cv2.resize(img,(width,height) , interpolation = cv2.INTER_AREA)    
    size = (width,height)
    img_array.append(resized)
out = cv2.VideoWriter('multiverse/project_mv.avi',cv2.VideoWriter_fourcc(*'DIVX'), 1, size)
print(len(img_array))
for i in range(len(img_array)):
    out.write(img_array[i])
out.release()

