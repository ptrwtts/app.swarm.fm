angular.module('myApp.controllers').controller('ConcertsCtrl', function($scope,$rootScope,$routeParams,$http,$sce,$location) {
  	$scope.currentSource = $routeParams.source;
  	$scope.status = {
		isopen: false
	};	
	$scope.ratings = [
		{status:2,icon:"ion-close-circled"},
		{status:0,icon:"ion-help-circled"},
		{status:1,icon:"ion-checkmark-circled"}
	];
	$scope.descriptions = {
		myartists:"Upcoming concerts you might like",
		new:"Recently announced concerts",
		all:"All upcoming concerts"	
	};
	$scope.toggleDropdown = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    $scope.status.isopen = !$scope.status.isopen;
	};
  	$scope.isActive = function(route,pos) {
        return route === $location.path().split('/')[pos];
    }
  	$scope.openConcert = function(concert) {
		concert.open=true; 
		if(concert.full) {
			$rootScope.playMusic('artist',concert.artists.map(function(a){ return a.id; }));
		} else {
			$scope.fullLineup(concert);
        	ga('send', 'event', 'Expand', 'ExpandConcert', concert.id);
		}
  	}
	var previous;
	var now = new Date();
	var today = now.getFullYear()+'-'+('0'+(now.getMonth()+1)).slice(-2)+'-'+('0'+now.getDate()).slice(-2);
	var thisweek = new Date(today).getTime()/1000/60/60/24/7;
  	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  	$scope.sections = [];
  	$scope.concerts = 0;
  	$scope.busy = false; $scope.finished = false;
  	$scope.moreConcerts = function() {
  		if(!$scope.busy && !$scope.finished) {
	  		$scope.busy = true;
	  		var params = {
	  			key:$rootScope.user.apikey,
	  			source:$scope.currentSource,
	  			start:$scope.concerts
	  		}
		  	var url = "http://app.swarm.fm/api/concerts.php?"+$.param(params);
		  	console.log(url);
		  	$http({method: 'GET', url: url}).
			    success(function(data, status, headers, config) {
			    	if(data.concerts) {
			    		if($scope.concerts==0) { $scope.area = data.area; }
			    		$.each(data.concerts,function(section,concerts){
			    			if(section!=previous) {
				    			$scope.sections.push({
				    				"title":section,
				    				"concerts":[]
				    			});
				    			previous = section;
				    		} 
				    		$.each(concerts,function(i,concert){
				    			concert.open = false;
				    			$scope.sections[$scope.sections.length-1].concerts.push(concert);
				    		});			
			      		});
				    	$scope.concerts += 50;
			      	} else {
			      		$scope.finished = true;
			      	}
	  				$scope.busy = false;
			    }).
			    error(function(data, status, headers, config) {
	  				$scope.busy = false;
			      	console.log(data);
			    });	
		}	
  	}
  	$scope.fullLineup = function(concert) {  		
  		var params = {
	  		key:$rootScope.user.apikey,
	  		event: concert.id,
	  		artists: concert.artists.map(function(a){ return a.name; })
  		}
  		var url = "http://app.swarm.fm/api/concerts.php?"+$.param(params);
  			  	$http({method: 'GET', url: url}).
  				    success(function(data, status, headers, config) {
  				    	if(data && data.length) {
  				    		console.log('adding');
  				    		concert.artists = concert.artists.concat(data);
  				    	}
  				    	concert.full = true;
	    				$rootScope.playMusic('artist',concert.artists.map(function(a){ return a.id; }));
  				      	console.log(data);
  				    }).
  				    error(function(data, status, headers, config) {
  				      	console.log(data);
  				    });	
  	}
  	$(window).scroll(function () { 		
  	   	if($(window).scrollTop() >= $(document).height() - $(window).height() - 200) {
  	   		$scope.moreConcerts();
  	   	}   	
  	});
  	$scope.moreConcerts();
})
  