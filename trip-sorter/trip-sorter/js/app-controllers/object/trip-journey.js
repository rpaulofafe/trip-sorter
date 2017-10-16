'use strict';

/** Object that shows the whole journey from place to place **/
function TripJourney (pathArray, cityFastestConnectionMap) {
	this.path = [];
	this.totalPrice = 0;
	
	var totalTimeMinutes = 0;
	
	//creates the information to contain every deal in the itinerary 
	for(var i=0; pathArray && i<pathArray.length - 1; ++i) {
		var from = pathArray[i];
		var to = pathArray[i + 1];
		var itinerary = cityFastestConnectionMap[from][to];
		
		this.path.push(itinerary);
		this.totalPrice += itinerary.finalPrice; //total journey price
		totalTimeMinutes += parseInt(itinerary.duration.h) * 60 + parseInt(itinerary.duration.m);
	}
	
	//total journey duration
	this.duration = {
		h : Math.trunc(totalTimeMinutes / 60),
		m : (totalTimeMinutes % 60)
	}
}