# workflow-base

This is an experimental project to create a workflow for developing angular based frontend with 
Behaviour Driven Development and API Driven Development.
Angular parts are based on "John Papa's angular style guide".

This workflow is divided in 3 phases: Setup, Development and Deploy

## Setup

* Install all needed libraries
* Setup any templates and styles (bootstrap, foundation, etc.)

## Development

* Create tests with karma and jasmine
* Develop all the angular parts ( services, controllers, routing, etc )
* Inject automatically new javascript and style files in html files
* Check if all tests are passed

## Deploy 

* Concatenetate all js files in one file and all css files in one file
* Minify all these files 
* Uglify all these files
* Revisioning files
