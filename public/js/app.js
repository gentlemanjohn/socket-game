'use strict';

/* Declare app level module */

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ngAnimate',
  'ui.router',
  'cfp.hotkeys'
])

  .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $state.appTitle = "Socket.IO Game";
  }])

  .config(function($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

    var checkLoggedin = function($q, $timeout, $location, User) {
      // Initialize a new promise
      var deferred = $q.defer();
      // Make an AJAX call to check if the user is logged in
      User.loggedin()
        .success(function(user) {
          // Authenticated
          if (user !== '0')
            $timeout(deferred.resolve, 0);
          // Not Authenticated
          else {
            $timeout(function(){deferred.reject();}, 0);
            $location.url('/login');
          }
        });
      return deferred.promise;
    }

    $httpProvider.interceptors.push('myHttpInterceptor');

    $stateProvider
      .state('Home', {
        url: '/',
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      })
      .state('Login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
      .state('Admin', {
        url: '/admin',
        templateUrl: 'partials/admin.html',
        controller: 'AdminCtrl',
        resolve: { 
          loggedin: checkLoggedin
        }
      });

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

  });