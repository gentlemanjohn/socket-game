'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

  .controller('AppCtrl', function($scope, User, Bears, Players, socket, hotkeys) {

    $scope.logout = function() {
      User.logout();
    }

    // example data GET
    Bears.get()
      .success(function(data) {
        $scope.bears = data;
      });

    // Game
    // ---------------------------------------------------

    socket.on('create player', function(socket_id, x, y, facing, avatar){
      Players.create($.param({'_id': socket_id, 'x': x, 'y': y, 'facing': facing, 'avatar': avatar}))
        .success(function() {
          // Players.get()
          //   .success(function(data) {
          //     $scope.players = data;
          //   });
        });
      $scope.$digest();
    });

    socket.on('get players', function(data) {
      Players.get()
        .success(function(data) {
          $scope.players = data;
        });
      $scope.$digest();
    });

    socket.on('message', function(data) {
      console.log(data);
    });

    socket.on('delete player', function(socket_id) {
      console.log('delete ' + socket_id);
      Players.delete(socket_id)
        .success(function(data) {
          Players.get()
            .success(function(data) {
              $scope.players = data;
            });
        });
      $scope.$digest();
    });

    $scope.move = function(direction) {
      socket.emit('change player', direction);
    }

    hotkeys.bindTo($scope)
      .add({
        combo: 'w',
        description: 'Move up',
        callback: function() {
          $scope.move('up')
        }
      })
      .add({
        combo: 'a',
        description: 'Move left',
        callback: function() {
          $scope.move('left')
        }
      })
      .add({
        combo: 's',
        description: 'Move down',
        callback: function() {
          $scope.move('down')
        }
      })
      .add({
        combo: 'd',
        description: 'Move right',
        callback: function() {
          $scope.move('right')
        }
      });

    // Chat
    // ---------------------------------------------------
    $scope.msgs = [];

    $scope.sendMsg = function() {
      socket.emit('send msg', $scope.msg.text);
      $scope.msg.text = '';
    }

    socket.on('get msg', function(data, id){
      $scope.msgs.push('User ' + id + ' says: ' + data);
      console.log('message sent from ' + id);
      $scope.$digest();
    });

  })

  .controller('LoginCtrl', function($scope, $location, User) {
    
    $scope.user = {};

    $scope.login = function(){
      if($scope.user) {
        User.login($scope.user)
          .success(function(data) {
            $location.url('/admin');
          })
          .error(function() {
            $location.url('/login');
          });
      }
    }

  })

  .controller('AdminCtrl', function($scope, Bears, Players) {

    Players.get()
      .success(function(data) {
        $scope.players = data;
      });

    // example form data model
    $scope.formData = {};

    // example data POST
    $scope.submit = function() {
      if($scope.formData) {
        Bears.create($scope.formData)
          .success(function(data) {
            $scope.formData = {};
            Bears.get()
              .success(function(data) {
                $scope.bears = data;
              });
          });
      }
    }

    // example data DELETE
    $scope.delete = function(socket_id) {
      Players.delete(socket_id)
        .success(function(data) {
          Players.get()
              .success(function(data) {
                $scope.players = data;
              });
        });
    }

  });