'use strict';

/** Validates that the city of arrival is different from departure **/
(function () { 
	$tripSorterApp.directive('targetCityDifferent', function() {
	    return {
	        require: 'ngModel',
	        link: function(scope, element, attr, tripSorterController) {
	        	
	        	tripSorterController.$parsers.push(function cityValidatorFunc (value) {
	        		if(attr['name'] == 'toCity') {
	        			tripSorterController.$setValidity('targetCityDifferent', (value != scope.fromCity));
	        		} else if(attr['name'] == 'fromCity') {
	        			//i want the error to be always associated with the target city
	        			scope.citiesForm.toCity.$error.targetCityDifferent = (value == scope.toCity);
	        			scope.citiesForm.toCity.$validate();
	        		}
	        		scope.citiesForm.$setValidity("targetCityDifferent", !scope.citiesForm.toCity.$error.targetCityDifferent);
	        		return value;
	            });
	        }
	    };
	});
}) ();