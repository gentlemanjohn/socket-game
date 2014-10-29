'use strict';

/* Services */

angular.module('myApp.services', [])

  .factory('User', ['$http', '$rootScope', function($http, $rootScope) {
    return {
      loggedin: function() {
        return $http.get($rootScope.baseUrl + '/loggedin');
      },
      login: function(userData) {
        return $http.post($rootScope.baseUrl + '/login', userData);
      },
      logout: function() {
        return $http.post($rootScope.baseUrl + '/logout');
      }
    }
  }])

  // example data service
  .factory('Bears', ['$http', '$rootScope', function($http, $rootScope) {
    return {
      get: function() {
        return $http.get($rootScope.baseUrl + '/api/bears');
      },
      create: function(bearData) {
        return $http.post($rootScope.baseUrl + '/api/bears', bearData);
      },
      delete: function(id) {
        return $http.delete($rootScope.baseUrl + '/api/bears/' + id);
      }
    }
  }])

  .factory('Players', ['$http', function($http){
    return {
      get: function() {
        return $http.get('/api/players');
      },
      create: function(playerData) {
        // return $http.post('/api/players', playerData);
        return $http({
          url: '/api/players',
          method: 'POST',
          data: playerData,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      },
      getId: function(socket_id) {
        return $http.get('/api/players/' + socket_id);
      },
      change: function(socket_id, playerData) {
        return $http({
          url: '/api/players/' + socket_id,
          method: 'PUT',
          data: playerData,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      },
      delete: function(socket_id) {
        return $http.delete('/api/players/' + socket_id);
      }
    }
  }])

  .factory('socket', function($rootScope) {
    var socket = io();
    return socket;
  });