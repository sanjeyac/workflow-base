# workflow-base

A set of preconfigured tools to improve frontend productivity.

This  project aims to create a workflow for developing angular based frontend with 
Behaviour Driven Development and API Driven Development.
Angular code style is based on "John Papa's angular style guide".

Here are the workflow's steps.

* Download the project from git
```git clone https://github.com/sanjeyac/workflow-base```
* Install all needed tools running 
``` npm start ```
* Add all your needed dependencies with bower command ( bootstrap, foundation5, leaflet, etc ) 
```bower install leaflet --save```
* Add all downloaded css/js files to your html files automatically with
```gulp dev```
* Run tests while developing
```gulp test```
* Deploy app with concatenation and minification of all js and css files.
```gulp deploy```

## What can I do with this thing?

### Setup

* Install all needed libraries with bower
* Setup any templates and styles (bootstrap, foundation, etc.)

### Development

* Create tests with karma and jasmine
* Develop all the angular parts ( services, controllers, routing, etc )
* Inject automatically new javascript and style files in html files
* Check if all tests are passed

### Deploy 

* Concatenetate all js files in one file and all css files in one file
* Minify all these files 
* Uglify all these files
* Revisioning files

### TODO
Need to refactor all Gulp tasks
Corrects deploy css/js paths
