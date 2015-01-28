'use strict';

/* Directives */

angular.module('myApp.directives', [])

  .directive('measure', function($window) {
    return function($scope) {
      $scope.initializeWindowSize = function() {
        $scope.viewportHeight = $window.innerHeight;
        return $scope.viewportWidth = $window.innerWidth;
      };
      $scope.initializeWindowSize();
      return angular.element($window).bind('resize', function() {
        $scope.initializeWindowSize();
        return $scope.$apply();
      });
    };
  })

  .directive('appVersion', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });