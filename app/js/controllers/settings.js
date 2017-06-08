angular.module('myApp.controllers').controller('SettingsCtrl', function($scope,$rootScope,$http) {
  	// Fetch user's current metro
  	var url = "http://app.swarm.fm/api/user.php?detail=metro&key="+$rootScope.user.apikey;
		$http({method: 'GET', url: url}).
	    success(function(data, status, headers, config) {
	    	$scope.area = data.area
	    }).
	    error(function(data, status, headers, config) {
	      	console.log(data);
	    });
	// Watch for searches
  	$(".searchbar").keyup(function(e) {
  		var code = e.keyCode || e.which;
  		if(code == 13) { //Enter keycode
  		   $scope.searchMetros();
  		   $(".searchbar").blur();
  		}
  	});	
  	// Fetch locations
	$scope.searchMetros = function() {
	  	var url = "http://api.songkick.com/api/3.0/search/locations.json?query="+$(".searchbar").val()+"&apikey=QXkZFoDY40YEH0oN&jsoncallback=JSON_CALLBACK&callback=JSON_CALLBACK";
	  	$http.jsonp(url).
		    success(function(data, status, headers, config) {
		    	$scope.metros = []; $scope.done = {}
		    	$.each(data.resultsPage.results.location,function(i,location){
		    		if(!$scope.done[location.metroArea.id]) {
		    			$scope.metros.push(location.metroArea);
		    			$scope.done[location.metroArea.id] = true;
		    		}
		    	})
		    	console.log($scope.metros);
		    }).
		    error(function(data, status, headers, config) {
		      	console.log(data, status);
		    });
	}
	$scope.setMetro = function(metro) {
		ga('send', 'event', 'Setting', "ChangeConcertCity", $scope.area+" > "+metro.displayName);
		$scope.area = metro.displayName;
		$scope.metros = {};
		$(".searchbar").val('');
		var params = {
			metro:metro.id,
			name:metro.displayName
		};
		$rootScope.editUser(params);
	}
});