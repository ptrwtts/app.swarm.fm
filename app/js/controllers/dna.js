angular.module('myApp.controllers').controller('DnaCtrl', function($scope,$rootScope,$http) {
  	$scope.artists = [];
  	$scope.getArtists = function() {
  		if(!$scope.busy && !$scope.finished) {
	  		$scope.busy = true;
		  	var url = "http://app.swarm.fm/api/artists.php?key="+$rootScope.user.apikey+"&source=myartists&limit=1000";
	  		console.log(url);
		  	$http({method: 'GET', url: url}).
			    success(function(data, status, headers, config) {
			    	if(data.length) {
			    		$.each(data,function(i,artist){
				    		$scope.artists.push(artist);
			      		});
			      	} else {
			      		$scope.finished = true;
			      	}
	  				$scope.busy = false;
			      	console.log(data);
			    }).
			    error(function(data, status, headers, config) {
	  				$scope.busy = false;
			      	console.log(data);
			    });	
		}	
	}
	$scope.getArtists();
});