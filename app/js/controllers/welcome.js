angular.module('myApp.controllers').controller('WelcomeCtrl', function($scope,$rootScope,$http,$route,$location) {
	// Handle Spotify
	$scope.receiveMessage = function(event){
	    if (event.origin !== "http://app.swarm.fm") {  return; }
	    if (authWindow) {
	    	console.log(event.data);
	    	$rootScope.user = JSON.parse(event.data);
            $rootScope.storeUser();
	        authWindow.close();
			$rootScope.loggedIn = true;
       		$rootScope.updateRequired = false;
        	$rootScope.checkUpdate();
			if($rootScope.user.status=='returning') {
				$scope.showApp();
			} else {				
				$scope.getConcertMetro();  
			}
		  	$scope.getPersonalPlaylists();	  		
	    }
	}

	$scope.showApp = function() {
		$scope.importing = false;
		$location.path('/releases');
	}

	$scope.getPersonalPlaylists = function() {
		$scope.importing = true;
	  	var url = "http://app.swarm.fm/api/playlists.php?key="+$rootScope.user.apikey;
	  	$http({method: 'GET', url: url}).
		    success(function(data, status, headers, config) {
		    	if($rootScope.user.status!='returning') {
		    		$scope.showApp();
		    	}
        		$rootScope.checkUpdate();
		      	console.log(data);
		      	$scope.getFollowedPlaylists();
		    }).
		    error(function(data, status, headers, config) {
		    	if($rootScope.user.status!='returning') {
		    		$scope.showApp();
		    	}
		      	console.log(data, status);
		      	$scope.getFollowedPlaylists();
		    });
	}

	$scope.getFollowedPlaylists = function() {
	  	var url = "http://app.swarm.fm/api/playlists.php?type=followed&key="+$rootScope.user.apikey;
	  	$http({method: 'GET', url: url}).
		    success(function(data, status, headers, config) {
				$route.reload(); // hacky
		      	console.log(data);
        		$rootScope.checkUpdate();
		    }).
		    error(function(data, status, headers, config) {
		      	console.log(data, status);
		    });
	}

	$scope.getConcertMetro = function() {
	  	var url = "http://api.songkick.com/api/3.0/search/locations.json?location=clientip&apikey=QXkZFoDY40YEH0oN&jsoncallback=JSON_CALLBACK&callback=JSON_CALLBACK";
	  	$http.jsonp(url).
		    success(function(data, status, headers, config) {
		    	var metro = data.resultsPage.results.location[0].metroArea;		    	
		    	var params = {
		    		metro:metro.id,
		    		name:metro.displayName
		    	};
		    	$rootScope.editUser(params);
		    }).
		    error(function(data, status, headers, config) {
		      	console.log(data, status);
		    });
	}

	window.addEventListener("message", $scope.receiveMessage, false);

	var authWindow = null;

	$scope.login = function() {
	    var width = 440,
	        height = 660;
	    var left = (screen.width / 2) - (width / 2);
	    var top = (screen.height / 2) - (height / 2);
	    var permissions = [
	    	"playlist-modify-public",
	    	"playlist-modify-private",
	    	"playlist-read-private",
	    	"streaming",
	    	"user-library-modify",
	    	"user-library-read",
	    	"user-read-private",
	    	"user-read-email"
	    ];
	    
	    authWindow = window.open(
	        "https://accounts.spotify.com/authorize?client_id=ea654b0003ae439abebd2bb2f5ad154b&response_type=code&redirect_uri=http%3A%2F%2Fapp.swarm.fm%2Fapi%2Fauth.php&scope="+permissions.join('+'),
	        "Spotify",
	        'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
	    );
	}

})