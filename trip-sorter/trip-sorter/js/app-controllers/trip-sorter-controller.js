'use strict';
(function () {
	
	/************************************************************
	 * 					Controller Definition 					* 
	 ************************************************************/
	$tripSorterApp.controller('tripSorterController', function($http, $scope) {
		
		/** Available Cities to be used by the auto-complete **/
		$scope.availableCities = determineAvailableCities();
		
		/** Currency to be used **/
		$scope.currency = currency_symbols[allData.currency] || allData.currency;
		
		/** by default use "cheapest" **/
		$scope.fastest = "no";
		
		/** search path button **/
		$scope.searchPath = function () {
			$scope.pathInfo = getPathInfo($scope.fromCity, $scope.toCity, $scope.fastest == "yes");
		};
		
		/** Show Modal, update the current itinerary **/
		$scope.showModal = function (itinerary) {
			$scope.selectedPriceInfo = itinerary;
		};
	});
	
	
	
	/************************************************************
	 * 					Support Functions 						* 
	 ************************************************************/
	
	//cities available (auto-complete)
	var determineAvailableCities = function () {
		
		var availableCities = [];
		/** 
		 * Iterate all data to get the cities involved  
		 * "allData" is the mocked data delivered in response.json (see the file response.js) 
		 **/
		if(allData && allData.deals) {
			angular.forEach(allData.deals, function(value) {
				var departureCity = value.departure;
				var arrivalCity = value.departure;
				
				if (departureCity && availableCities.indexOf(departureCity) == -1) {
					availableCities.push(departureCity);
				}
				
				if (arrivalCity && availableCities.indexOf(arrivalCity) == -1) {
					availableCities.push(arrivalCity);
				}
			});
		}
		
		return availableCities;
	}
	
	
	//search path between given cities
	var getPathInfo = function (fromCity, toCity, isFastest) {
		
		var map = {}; //stores the map to be used by the shortest path algorithm, with edges cost (Dijkstra)
		var cityFastestConnectionMap = {}; //map "departure,arrival" with every deal
		
		if(allData && allData.deals) {
			angular.forEach(allData.deals, function(aDeal) {
				var departure = aDeal.departure;
				var arrival = aDeal.arrival;
				
				var tripCost; // to be filled with the trip cost of the deal (either price or minutes)
				
				//trip cost based on time
				var tripCostTime = parseInt(aDeal.duration.h) * 60 + parseInt(aDeal.duration.m); //trip cost in total of minutes
				
				//trip cost based on price
				var discount = aDeal.discount ? aDeal.discount : 0;
				var priceValMult = 1.0 - discount / 100.0;
				var tripCostPrice = aDeal.cost * priceValMult; //trip cost is the price
				
				//i want to add a small fraction to the edge cost to decide in case the weight (cost) is the same
				//for example, if i have the option "fastest" selected and 2 trips (either direct-connection or not) take the same time,
				//i want to pick up the cheapest.
				//The same in the opposite scenario, when "cheapest" is selected
				var dividerCaseDraw = 1000000; //just a large number
				
				//select type of edge cost (either the cheapest or the fastest)
				if(isFastest) {
					tripCost = tripCostTime + (tripCostPrice / dividerCaseDraw); //trip cost is the price
				} else {
					tripCost = tripCostPrice + (tripCostTime / dividerCaseDraw); //trip cost is the price
				}
				
				//create objs if not existant
				if(!map[departure]) {
					map[departure] = {};
				}
				
				if(!cityFastestConnectionMap[departure]) {
					cityFastestConnectionMap[departure] = {};
				}
				
				//there can be more than one way to go from cityA to cityB (same nodes)
				//in this case, select the cheapest cost between the 2 nodes
				if(!map[departure][arrival] || map[departure][arrival] > tripCost) {
					map[departure][arrival] = tripCost;
					cityFastestConnectionMap[departure][arrival] = new Itinerary(aDeal);
				}
				
			});
		}
		
		//delivers the path in the format ["London", "Paris", "etc"] (graph.js library) Dijkstra algorithm
		console.log("Map with the cheapest (either time cheaper or price cheaper) costs between 2 edges:");
		console.log(map);
		
		console.log("City Best-Connections per city:");
		console.log(cityFastestConnectionMap);
		
		var graph = new Graph(map);
		var path = graph.findShortestPath(fromCity, toCity);  
		
		//converts the path to the format [deal1, deal2, dealN] to be easily read by the front-end
		return new TripJourney(path, cityFastestConnectionMap);
	}
	
	
	
	
	
	/** Currency symbols **/
	var currency_symbols = {
		    'USD': '$', // US Dollar
		    'EUR': '€', // Euro
		    'CRC': '₡', // Costa Rican Colón
		    'GBP': '£', // British Pound Sterling
		    'ILS': '₪', // Israeli New Sheqel
		    'INR': '₹', // Indian Rupee
		    'JPY': '¥', // Japanese Yen
		    'KRW': '₩', // South Korean Won
		    'NGN': '₦', // Nigerian Naira
		    'PHP': '₱', // Philippine Peso
		    'PLN': 'zł', // Polish Zloty
		    'PYG': '₲', // Paraguayan Guarani
		    'THB': '฿', // Thai Baht
		    'UAH': '₴', // Ukrainian Hryvnia
		    'VND': '₫', // Vietnamese Dong
		    'AED' : 'د.إ' //Emirati AED
		};	
}) ();