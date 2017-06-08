angular.module('myApp.controllers', []).controller('mainCtrl', function($scope,$location,$rootScope,$http,$sce,$timeout) {
	$scope.tabs = [
		{path:"releases",label:"Releases",icon:"ion-disc"},
		{path:"concerts",label:"Concerts",icon:"ion-calendar"},
        {path:"artists",label:"Artists",icon:"ion-person"}
	];		
	$scope.isActive = function(route) {
        return route === $location.path().split('/')[1];
    }
    $scope.logOut = function() {
      localStorage.removeItem('swarmuser');
    }
    $rootScope.checkUpdate = function() {
        $http({method: 'GET', url: "http://app.swarm.fm/api/checkupdate.php?key="+$rootScope.user.apikey}).
        success(function(data, status, headers, config) {
            if(data.error) {
                localStorage.removeItem('swarmuser');
                $rootScope.loggedIn = false;
                $rootScope.updateRequired = true;
                $location.path('/welcome');
            } else {
                if(!data.tracking) { data.tracking = 'null'; }
                if(!data.curated) { data.curated = 'null'; }
                console.log("Tracking: "+data.tracking+", Curated: "+data.curated);
                ga('set', {
                    'dimension1': 'Registered',
                    'dimension2': $rootScope.user.id,
                    'dimension3': data.tracking,
                    'dimension4': data.curated
                });
            }
        }).
        error(function(data, status, headers, config) {
            localStorage.removeItem('swarmuser');
            $rootScope.loggedIn = false;
            $rootScope.updateRequired = true;
            $location.path('/welcome');
        });
    }

    $scope.version = 1;
    

    // Check for Mobile vs Desktop
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    	$rootScope.mobile = true;
		$rootScope.desktop = false;
	} else {
		$rootScope.mobile = false;
		$rootScope.desktop = true;			
	}

    if(!localStorage['swarmuser'] || localStorage['swarmuser']=="null") {
        localStorage.removeItem('swarmuser');
        $location.path('/welcome');
    } else {
        $rootScope.user = JSON.parse(localStorage['swarmuser']);
        $rootScope.loggedIn = true;

        // Check if need to relogin
        $rootScope.checkUpdate();

    }

    $rootScope.today = function() {
        var now = new Date();
        return now.getFullYear()+'-'+('0'+(now.getMonth()+1)).slice(-2)+'-'+('0'+now.getDate()).slice(-2);
    } 

    $rootScope.storeUser = function() {
        localStorage['swarmuser'] = JSON.stringify($rootScope.user);
    }

    

    $rootScope.playMusic = function(type,ids,title) {
      	if($rootScope.mobile) { return true; }
      	var url = "http://app.swarm.fm/api/tracks.php?"+type+"="+ids.join(',');
 		$http({method: 'GET', url: url}).
	    success(function(data, status, headers, config) {
	    	console.log("https://embed.spotify.com/?uri=spotify:trackset:Swarm.fm:"+data.join(','));
  			$rootScope.playeropen = true;
	    	$rootScope.playersrc = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=spotify:trackset:Swarm.fm:"+data.join(','));
	      	//console.log(data);
	    }).
	    error(function(data, status, headers, config) {
	      	console.log(data);
	    });
    }

    $rootScope.rateArtist = function(artist,status) {
      	if(status==artist.status) {
      		switch(artist.status) {
      			case 6: status = 1; break;
      			case 1: status = 0; break;
      			case 2: status = 0; break;
      		}
      	}
        labels = {
            "0":"Unknown",
            "1":"Follow",
            "2":"Remove",
            "6":"Fave",
        }
        console.log(artist,status);
 		var url = "http://app.swarm.fm/api/editartist.php";
 		var postData = {
 			key:$rootScope.user.apikey,
 			artist:artist.id,
            artist_id:artist.artist_id,
 			status:status
 		}
 		artist.status = status;
 		$http({method: 'POST', url: url, data: postData}).
    	    success(function(data, status, headers, config) {
    	      	console.log(data);
    	    }).
    	    error(function(data, status, headers, config) {
    	      	console.log(data);
    	    });
        ga('send', 'event', 'RateArtist', labels[status], artist.name);
	}

    $rootScope.outboundLink = function(type,url) {
        ga('send', 'event', 'ExternalLink', type, url);
    }

    $rootScope.externalLink = function(type,url) {
        
        ga('send', 'event', 'ExternalLink', type, url, {
            hitCallback: function() {
                window.location = url;
            }
        });
    }

    $rootScope.editUser = function(params) {
        var url = "http://app.swarm.fm/api/edituser.php";
        params.key = $rootScope.user.apikey;
        $http({method: 'POST', url: url, data: params}).
            success(function(data, status, headers, config) {
              console.log(data);
              $rootScope.user.playlist = data.playlist;
            }).
            error(function(data, status, headers, config) {
              console.log(data);
            });
    }

    $rootScope.addToPlaylist = function(uri) {
        var url = "http://app.swarm.fm/api/addtoplaylist.php?key="+$rootScope.user.apikey+"&uri="+uri;
        $http({method: 'GET', url: url}).
            success(function(data, status, headers, config) {
              console.log(data);
            }).
            error(function(data, status, headers, config) {
              console.log(data);
            });
        if($rootScope.toasttimer) { $timeout.cancel($rootScope.toasttimer); }
        $rootScope.toast = true;
        $rootScope.toasttimer = $timeout( function() { $rootScope.toast = false; }, 3000 );
    }

    $rootScope.addToSpotify = function(uri) {
        var url = "http://app.swarm.fm/api/addtospotify.php?key="+$rootScope.user.apikey+"&uri="+uri;
        $http({method: 'GET', url: url}).
            success(function(data, status, headers, config) {
              console.log(data);
            }).
            error(function(data, status, headers, config) {
              console.log(data);
            });
        ga('send', 'event', 'Add', 'AddToSpotify', uri);
    }
   
})