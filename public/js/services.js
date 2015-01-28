'use strict';

/* Services */

angular.module('myApp.services', [])

  .factory('myHttpInterceptor', function($q, $location) {
    return {
      response: function(response) {
        return response;
      },
      responseError: function(response) {
        if (response.status === 401) {
          $location.url('/login');
        }
        return $q.reject(response);
      }
    };
  })

  .factory('User', ['$http', function($http) {
    return {
      loggedin: function() {
        return $http.get('/loggedin');
      },
      login: function(userData) {
        return $http.post('/login', userData);
      },
      logout: function() {
        return $http.post('/logout');
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