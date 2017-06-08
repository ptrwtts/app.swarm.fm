angular.module('myApp.controllers').controller('ArtistCtrl', function($scope,$rootScope,$routeParams,$http,$location,$sce) {
	$scope.id = $routeParams.id;
	$scope.ratings = [
		{status:2,icon:"ion-close-circled"},
		{status:0,icon:"ion-help-circled"},
		{status:1,icon:"ion-checkmark-circled"},
		{status:6,icon:"ion-heart"}
	];
	var params = {
		key:$rootScope.user.apikey,
		id:$scope.id
	}
	var url = "http://app.swarm.fm/api/artist.php?"+$.param(params);
	console.log(url);
	$http({method: 'GET', url: url}).
    success(function(data, status, headers, config) {
    	$scope.artist = data.artist;
    	$scope.similars = data.similars;
    	$scope.concerts = data.concerts;
      	console.log(data);
    }).
    error(function(data, status, headers, config) {
		$scope.busy = false;
      	console.log(data);
	});	

	$rootScope.playeropen = true;
	$rootScope.playersrc = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=spotify:artist:"+$scope.id);

});