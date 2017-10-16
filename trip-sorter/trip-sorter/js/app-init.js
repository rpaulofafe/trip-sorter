/**
 *  Dependencies (RequireJS) and initialization of the Angular APP
 **/
'use strict';
(function () {
	
	requirejs.config({
		//Load Libs
	    baseUrl: 'js',
	    paths: {
	    	//external-libs
	        lib: './ext-lib',
	        //angular controllers,
	        controller: 'app-controllers',
	        validator: 'app-validators',
	        responseJSON: './responseJSON/response'
	    }, 
	    
	    //dependencies 
		    shim : {
			'lib/bootstrap.min' : {
				deps : [ 'lib/jquery.min' ]
			},
			'lib/bootstrap3-typeahead.min' : {
				deps : [ 'lib/bootstrap.min' ]
			},
			'controller/trip-sorter-controller' : {
				deps : ['validator/trip-sorter-city-validator', 
						'lib/graph',
						'controller/object/trip-itinerary',
						'controller/object/trip-journey' ]
			}
		}
	});
	
	
	
	/** Load AngularJS, Bootstrap, the mocked data (response.json) and start the APP **/
	requirejs(['lib/angular.min',  'lib/bootstrap.min',  'responseJSON'],
		function   () {
			//initialize AngularJS app
			window.$tripSorterApp = angular.module('tripSorter', []);
			
			//controller to be used
			//in this case we have just one (and a single view), so no need to decide...
			//otherwise a mapping would be required
			requirejs(['controller/trip-sorter-controller'], function () {
				//bootstrap application
				angular.bootstrap(document, ['tripSorter']);
			});
	});
	
}) ();