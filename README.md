# browserify-file-size-tree

##What is this?
 - browserify-file-size-tree is a command-line utility similar to [disc](https://github.com/hughsk/disc).  It takes a javascript file as an entry point, then creates an html page allowing you to navigate the dependencies sorted by size.  I have not spent the time to make it as featured, but in my opinion it displays the information you want in a more intuitive format.

##Why does it exist?
 - The visual representation that disc provides wasn't what I wanted.  I wanted to quickly navigate the dependencies as a file-tree in order to find which were taking up the most space.

##Installation
```
npm install --save -g olsonpm/browserify-file-size-tree
```
 
##How to use
```
bfst <javascript file>
```
 
By running the above, a directory 'file-size-tree' is made and includes an index.html file (among some helper resources e.g. jquery).  Open index.html in order to view the dependencies.

##An example
[Here is the result](http://olsonpm.github.io/browserify-file-size-tree/) of running bfst on a recent pull from substack's node-browserify.  Yes it displays a small portion of my local file-structure, but in my opinion it is important to understand where the files are being referenced from.

##Note: This is beta
 - If you run into an issue, please email me!  I don't want to spend too much time writing tests ensuring the program works for absolutely everyone since it is a small project written in my spare time.  Given a specific error however, I am glad to help.
