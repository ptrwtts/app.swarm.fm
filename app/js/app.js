'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.bootstrap'
],function ($compileProvider,$locationProvider,$httpProvider) {
	// Prevents spotify URLs from being marked unsafe
  	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|spotify):/); 
  
  	//$locationProvider.html5Mode(true);

	// Enable CORS
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

}).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.otherwise({redirectTo: '/releases'});

  $routeProvider.when('/artist', {redirectTo: '/artists/myartists'});
  $routeProvider.when('/artist/:id', { templateUrl: '/partials/artist.html', controller: 'ArtistCtrl' });

  $routeProvider.when('/artists', {redirectTo: '/artists/myartists'});
  $routeProvider.when('/artists/:source', { templateUrl: '/partials/artists.html', controller: 'ArtistsCtrl' });

  $routeProvider.when('/concerts', {redirectTo: '/concerts/myartists'});
  $routeProvider.when('/concerts/:source', { templateUrl: '/partials/concerts.html', controller: 'ConcertsCtrl' });

  $routeProvider.when('/dna', { templateUrl: '/partials/dna.html', controller: 'DnaCtrl' });

  $routeProvider.when('/genres', { templateUrl: '/partials/genres.html', controller: 'GenresCtrl' });

  $routeProvider.when('/logout', { template: " ", controller: 'LogoutCtrl' });

  $routeProvider.when('/releases', {redirectTo: '/releases/latest'});
  $routeProvider.when('/releases/explore', {redirectTo: '/releases/explore/allartists/latest/all'});
  $routeProvider.when('/releases/:page/:source/:view/:filter', { templateUrl: '/partials/releases.html', controller: 'ReleasesCtrl' });
  $routeProvider.when('/releases/:page', { templateUrl: '/partials/releases.html', controller: 'ReleasesCtrl' });

  $routeProvider.when('/search', { templateUrl: '/partials/search.html', controller: 'SearchCtrl' });

  $routeProvider.when('/settings', { templateUrl: '/partials/settings.html', controller: 'SettingsCtrl' });

  $routeProvider.when('/welcome', { templateUrl: '/partials/welcome.html', controller: 'WelcomeCtrl' });

}]);
