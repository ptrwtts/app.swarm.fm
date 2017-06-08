angular.module('myApp.controllers').controller('ArtistsCtrl', function($scope,$rootScope,$routeParams,$http,$location) {
	$scope.currentSource = $routeParams.source;
	$scope.views = [
		{path:"myartists",label:"My Artists"},
		{path:"suggestions",label:"Suggestions"},
		{path:"hidden",label:"Hidden"}
	];
	$scope.ratings = [
		{status:2,icon:"ion-close-circled"},
		{status:0,icon:"ion-help-circled"},
		{status:1,icon:"ion-checkmark-circled"},
		{status:6,icon:"ion-heart"}
	];
	$scope.descriptions = {
		myartists:"The artists you are tracking. Remove any you don’t like",
		suggestions:"Artists you might like. Add them to start tracking",
		hidden:"Artists you marked as Unknown / Not Interested"
	};
	$scope.options = {myartists:[6,0,2],suggestions:[0,1,2],hidden:[1]};
	$scope.hidden = {myartists:[0,2],suggestions:[0,1,2],hidden:[1]};
	$scope.isActive = function(route) {
	    return route === $location.path().split('/')[2];
	}
  	$scope.capitalise = function(string) {
   		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	$scope.artists = [];
	$scope.scrambler = Math.random();
  	$scope.moreArtists = function() {
  		if(!$scope.busy && !$scope.finished) {
	  		$scope.busy = true;
	  		var params = {
	  			key:$rootScope.user.apikey,
	  			source:$scope.currentSource,
	  			scrambler:$scope.scrambler,
	  			start:$scope.artists.length
	  		}
		  	var url = "http://app.swarm.fm/api/artists.php?"+$.param(params);
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
  	$(window).scroll(function () { 		
  	   	if($(window).scrollTop() >= $(document).height() - $(window).height() - 600) {
  	   		$scope.moreArtists();
  	   	}   	
  	});
	$scope.moreArtists();
})