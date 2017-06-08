angular.module('myApp.controllers').controller('LogoutCtrl', function($scope,$rootScope,$location) {
  	console.log('logout!');
  	localStorage.removeItem('swarmuser');
	$rootScope.loggedIn = false;
	$location.path('/welcome');  		
});