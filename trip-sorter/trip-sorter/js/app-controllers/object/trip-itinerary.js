'use strict';

function Itinerary (aDeal) {
	Object.assign(this, aDeal);
	
	//calculated final cost
	this.discountCost = this.cost * this.discount / 100.0
	this.finalPrice = this.cost - this.discountCost;
}