'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('analytics', ['$rootScope', '$location',
      function ($rootScope, $location) {
      return {
          link: function (scope, elem, attrs, ctrl) {
              if(window.location.origin!="http://localhost:8888") {
                $rootScope.$on('$routeChangeSuccess', function(event, currRoute, prevRoute) {
                    ga('set', 'page', $location.path());
                    ga('send', 'pageview');
                });
              }              
          }
      }
  }])
  .directive('pagetitle', ['$rootScope', '$location',
      function ($rootScope, $location) {
      return {
          link: function (scope, elem, attrs, ctrl) {
              $rootScope.$on('$routeChangeSuccess', function(event, currRoute, prevRoute) {
                console.log($location.path());
                var path = $location.path().split('/')[1];
                $rootScope.pagetitle = path.charAt(0).toUpperCase() + path.slice(1);
              });        
          }
      }
  }]);
