angular.module('myApp.controllers').controller('ReleasesCtrl', function($scope,$rootScope,$routeParams,$http,$sce,$location) {
	$scope.currentPage = $routeParams.page;
	console.log($scope.currentPage);
	$scope.currentSource = $routeParams.source;
	$scope.currentView = $routeParams.view;
	$scope.currentFilter = $routeParams.filter;
	$scope.pages = [
		{path:'latest',label:"Latest",hidden:[0,2,3],options:[0,2]},
		{path:'highlights',label:"Highlights",hidden:[0,2,3],options:[0,2]},
		{path:'upcoming',label:"Upcoming"},
		{path:'explore',label:"Explore"}
	];
	$scope.hidden = {
		latest:[0,2,3],
		best:[0,2,3]
	}
	$scope.sources = ["allartists","myartists","suggestions","hidden"];
	$scope.views = ["latest","trending","popular"];
	$scope.filters = ["all","albums","singles"];
	$scope.labels = {
		"myartists":"My Artists",
		"suggestions":"Suggestions",
		"hidden":"Hidden Artists",
		"allartists":"All Artists",  		
		"latest":"Latest",
		"trending":"Trending",
		"popular":"Popular",
		"upcoming":"Upcoming",
		"all":"All",
		"albums":"Albums",
		"singles":"Singles"
	};
	$scope.statuses = {
		"myartists":1,
		"suggestions":0,
		"hidden":2
	};  	
  $scope.descriptions = {
    latest:"The newest releases from artists you are tracking",
    highlights:"Significant new releases that you might be interested in",
    upcoming:"Releases from your artists that are coming out soon",
    explore:"Adjust the parameters to find more interesting releases"
  };
	$scope.toggleDropdown = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    $scope.status.isopen = !$scope.status.isopen;
	};
  	$scope.isActive = function(route,pos) {
        return route === $location.path().split('/')[pos];
    }
  	$scope.cleanUrl = function(str) {
  		return str.replace(/\//g, '_');
  	};
  	$scope.alteredTitle = function(album) {
  		return album.type == 'single' ? '[s] '+album.name : album.name;
  	};
  	$scope.capitalise = function(string) {
   		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	$scope.hovered = function(album,state) {
		if($rootScope.desktop) {
			album.open = state;
		}
	}
	var previous;
  	$scope.sections = [];
  	$scope.sectionIndex = {};
  	$scope.upcomingsections = [];
  	$scope.albums = [];
  	$scope.counter = 0;
  	$scope.busy = false; $scope.finished = false;
  	$scope.today = $rootScope.today();
  	$scope.moreAlbums = function(playResults,fromsection) {
  		if($scope.busy || $scope.finished) { return false; }
  		$scope.busy = true;	  		
  		var params = {
  			key:$rootScope.user.apikey,
  			today:$scope.today,
  			start:$scope.counter
  		}
  		// Tweak which events to request
  		if(fromsection) {
  			fromsection.busy = true;	  		
  			params.fromsection = fromsection.num;
  			params.start = $scope.sections[$scope.sectionIndex[fromsection.title]].albums.length;
  			params.limit = 60;
  		} else if($scope.after) { 
  			params.aftersection = $scope.after; 
  		}
  		// Tweak based on the page being requested
  		if($scope.currentPage=='upcoming') {
  			var url = "http://app.swarm.fm/api/upcoming.php?"+$.param(params);
  		} else {
  			params.page = $scope.currentPage;
  			if($scope.currentPage=='explore') {
  				params.source = $scope.currentSource;
  				params.view = $scope.currentView;
  				params.filter = $scope.currentFilter;
  			}
  			var url = "http://app.swarm.fm/api/albums.php?"+$.param(params);
  		}
	  	$http({method: 'GET', url: url}).
		    success(function(data, status, headers, config) {
		    	var sections = $scope.currentPage=='upcoming' ? 'upcomingsections' : 'sections';
    			if(data.albums) {
		    		$.each(data.albums,function(section,albums){
		    			// If section doesn't yet exist, create it
		    			if($scope.sectionIndex[section]===undefined) {
			    			$scope.sectionIndex[section] = $scope[sections].length;
			    			$scope[sections].push({
			    				"title":section,
			    				"albums":[],
			    				"num":albums[0].section
			    			});
			    		} 
			    		var currentSection = $scope[sections][$scope.sectionIndex[section]];
			    		$.each(albums,function(i,album){
			    			currentSection.albums.push(album);
			    			if(!fromsection) { $scope.counter++; }
			    			if($scope.currentPage!='upcoming') { $scope.albums.push(album.id); }
			    		});			
			    		if(!fromsection && currentSection.albums.length>=60 && $scope.currentView=='latest') {
			    			currentSection.capped = true;
			    			$scope.counter = 0;
			    			$scope.after = currentSection.albums[0].section;
			    		}
		      		});    		 
		      		// If first request, gather     		
		      		if(playResults && $scope.albums.length>0) { $rootScope.playMusic('album',$scope.albums); }
		      	} else {
		      		if(fromsection) {  fromsection.capped = false; } else { $scope.finished = true; }
		      	}		      	
		      	if(fromsection) {  fromsection.busy = false; }
  				$scope.busy = false;
		    }).
		    error(function(data, status, headers, config) {
  				$scope.busy = false;
		      	console.log(data);
		    });	
  	}
  	//$scope.playeruri = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=spotify:album:7pomP86PUhoJpY3fsC0WDQ");
  	$scope.playAlbum = function(album) {
        ga('send', 'event', 'Listen', 'PlayAlbum', album.artist.name+" - "+album.name);
  		$rootScope.playeropen = true;
	    $rootScope.playersrc = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=spotify:album:"+album.id);
  		console.log(id);
  	}
  	$(window).scroll(function () { 		
  	   	if($(window).scrollTop() >= $(document).height() - $(window).height() - 200) {
  	   		$scope.moreAlbums();
  	   	}   	
  	});
  	$scope.moreAlbums(true);
})