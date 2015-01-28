'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

  .controller('AppCtrl', function($scope, $location, User) {
    $scope.logout = function() {
      User.logout()
      .success(function() {
        $location.url('/');
      })
      .error(function() {
        $location.url('/admin');
        console.log('There was an error logging out.');
      });
    }
  })

  .controller('HomeCtrl', function($scope, User, Players, socket, hotkeys) {

    // Game
    // ---------------------------------------------------

    socket.on('create board', function(boardX, boardY, boardUnit) {
      $scope.boardX = boardX;
      $scope.boardY = boardY;
      $scope.boardUnit = boardUnit;
    });

    socket.on('create player', function(socket_id, x, y, moving, facing, avatar){
      Players.create($.param({'_id': socket_id, 'x': x, 'y': y, 'moving': false, 'facing': facing, 'avatar': avatar}));
      $scope.playerX = x;
      $scope.playerY = y;
      $scope.$digest();
    });

    socket.on('viewport shift', function(x, y){
      $scope.playerX = x;
      $scope.playerY = y;
    });

    $scope.$watchGroup(['viewportHeight', 'viewportWidth', 'playerX', 'playerY'], function(newValue, oldValue, scope) {
      if (newValue !== oldValue) {
        $scope.shift = {
          'x': ($scope.viewportWidth/2) - $scope.playerX - ($scope.boardUnit/2),
          'y': ($scope.viewportHeight/2) - $scope.playerY - ($scope.boardUnit/2)
        }
      }
    });

    socket.on('get players', function(data) {
      Players.get()
        .success(function(data) {
          $scope.players = data;
        });
      $scope.$digest();
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

    $scope.move = function(event) {
      socket.emit('change player', event.offsetX, event.offsetY);
    }

    // hotkeys.bindTo($scope)
    //   .add({
    //     combo: 'w',
    //     description: 'Move up',
    //     callback: function() {
    //       $scope.move('up')
    //     }
    //   })
    //   .add({
    //     combo: 'a',
    //     description: 'Move left',
    //     callback: function() {
    //       $scope.move('left')
    //     }
    //   })
    //   .add({
    //     combo: 's',
    //     description: 'Move down',
    //     callback: function() {
    //       $scope.move('down')
    //     }
    //   })
    //   .add({
    //     combo: 'd',
    //     description: 'Move right',
    //     callback: function() {
    //       $scope.move('right')
    //     }
    //   });

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
            console.log('There was an error logging in.');
          });
      }
    }

  })

  .controller('AdminCtrl', function($scope, Players) {

    Players.get()
      .success(function(data) {
        $scope.players = data;
      });

    // example form data model
    $scope.formData = {};

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