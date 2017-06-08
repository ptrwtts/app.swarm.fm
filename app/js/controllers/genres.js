angular.module('myApp.controllers').controller('GenresCtrl', function($scope,$rootScope,$http) {
  	$scope.cleanUrl = function(str) {
  		return str.replace(/\//g, '_');
  	}
  	var url = "http://app.swarm.fm/api/genres.php?key="+$rootScope.user.apikey;
  	$http({method: 'GET', url: url}).
	    success(function(data, status, headers, config) {
	      $scope.genres = data;
	    }).
	    error(function(data, status, headers, config) {
	      console.log(data);
	    });
});
  