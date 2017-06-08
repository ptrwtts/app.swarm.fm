angular.module('myApp.controllers').controller('SearchCtrl', function($scope,$rootScope,$http) {
  	$scope.ratings = [
  		{status:2,icon:"close"},
  		{status:0,icon:"help"},
  		{status:1,icon:"checkmark"}
  	];
  	$(".searchbar").focus();
  	$(".searchbar").keyup(function() {
  		if($(".searchbar").val().length>1) {
  			$scope.searchArtists();
  		} else {
			$scope.artists = [];
			$scope.$apply();
  		}
  	});	

  	$scope.searchArtists = function() {
		if($scope.busy) { return false; }
		if($(".searchbar").val()==$scope.q) { return false; }
		$scope.q = $(".searchbar").val();
		$scope.busy = true;
		console.log($scope.q);
	  	var url = "http://app.swarm.fm/api/search.php?key="+$rootScope.user.apikey+"&q="+$scope.q;
	  	$http.get(url).
		    success(function(data, status, headers, config) {
		    	if(data) {
		    		$scope.artists = data;
		    		$scope.busy = false;
					if($(".searchbar").val()!=$scope.q) { $scope.searchArtists(); }
		    	} else {
		    		$scope.empty = true;
		    	}
		      	console.log(data);
		    }).
		    error(function(data, status, headers, config) {
		      	console.log(data, status);
		    });
  	}

});