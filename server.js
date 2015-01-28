//  ======================================
//  module dependecies
//  ......................................

var express = require('express'),
  app = express(),
  port = process.env.PORT || 8081,
  mongoose = require('mongoose'), // mongoose for mongodb
  passport = require('passport'), // passport for authentication
  flash = require('connect-flash'),
  morgan = require('morgan'), // log requests to the console (express4)
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'), // pull information from HTML POST (express4)
  session = require('express-session'),
  methodOverride = require('method-override'), // simulate DELETE and PUT (express4)
  path = require('path'),
  config = require('./config');

  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  var Player = require('./app/models/player');
  // var playerColors = ['red','blue','green','yellow','red','purple','DarkMagenta','DarkOrange','DeepPink','GreenYellow','Navy'];
  var playerAvatars = ['char1.png', 'char2.png', 'char3.png', 'char4.png', 'char5.png', 'char6.png', 'char7.png'];

  function impassableThings(things) {
    for(var i=0; i < things.length; i++) {
      if(things[i].x === player.x && things[i].y === player.y) {
        return false;
      } else {
        return true;
      }
    }
  }

  io.sockets.on('connection', function(socket){

    

    //  ======================================
    //  GAME
    //  ......................................

    // var randomColor = Math.floor(Math.random() * (playerColors.length + 1));
    var randomAvatar = Math.floor(Math.random() * (playerAvatars.length + 1));
    var boardX = 1280;
    var boardY = 640;
    var boardUnit = 32;
    io.sockets.emit('create board', boardX, boardY, boardUnit);
    io.sockets.emit('create player', socket.id, 0, 0, false, 'right', playerAvatars[randomAvatar]);
    console.log('Player ' + socket.id + ' has connected and been added to the database');
    io.sockets.emit('get players');

    socket.on('disconnect', function(){
      Player.remove({_id: socket.id}, function(err, player) {
        console.log('Player ' + socket.id + ' has disconnected and been deleted from the database');
      });
      io.sockets.emit('get players');
    });

    socket.on('change player', function(offsetX, offsetY) {
      Player.findById(socket.id, function(err, player) {
        if(err)
          res.send(err);
        // x-axis movement units
        var xMove = Math.round(Math.ceil(offsetX - player.x - boardUnit/2)/boardUnit);
        // y-axis movement units
        var yMove = Math.round(Math.ceil(offsetY - player.y - boardUnit/2)/boardUnit);
        // total number of iterations needed to move to click target
        var m = (Math.abs(xMove) >= Math.abs(yMove)) ? Math.abs(xMove) : Math.abs(yMove);
        // calculate facing direction based on targeted journey
        if(Math.abs(xMove) >= Math.abs(yMove) && xMove > 0) {
          player.facing = 'right';
        } else if(Math.abs(xMove) >= Math.abs(yMove) && xMove < 0) {
          player.facing = 'left';
        } else if(Math.abs(yMove) >= Math.abs(xMove) && yMove > 0) {
          player.facing = 'down';
        } else if(Math.abs(yMove) >= Math.abs(xMove) && yMove < 0) {
          player.facing = 'up';
        }
        // toggle moving animation
        player.moving = true;
        // move player
        (function move(i) {
          if(i===0) return;
          setTimeout(function () {
            if(xMove > 0) {
              player.x += boardUnit;
              xMove--;
            } else if (xMove < 0) {
              player.x -= boardUnit;
              xMove++;
            }
            if(yMove > 0) {
              player.y += boardUnit;
              yMove--;
            } else if (yMove < 0) {
              player.y -= boardUnit;
              yMove++;
            }
            player.save();
            io.sockets.emit('get players');
            io.to(socket.id).emit('viewport shift', player.x, player.y);       
            if(--i) {
              move(i);
            } else {
              player.moving = false;
            }
          }, boardUnit * 3);
        })(m);
      });
    });

    //  ======================================
    //  CHAT
    //  ......................................

    socket.on('send msg', function(data) {
      console.log('message sent');
      io.sockets.emit('get msg', data, socket.id);
    });

  });



//  ======================================
//  configuration
//  ......................................

mongoose.connect(config.database.uri); // connect to database

// require('./config/passport')(passport); // pass passport for configuration
// using this instead for simple one user login:
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy( 
  function(username, password, done) {
    if (username === config.app.username && password === config.app.password)
      return done(null, { name: config.app.username });
    return done(null, false, { message: 'Invalid Login.' });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // parse application/json; enables us to get data from a POST
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(path.join(__dirname, 'public'))); // set the static files location

// required for passport
app.use(session({ secret: 'fitoreandjohnarethebombdotcom', resave: true, saveUninitialized:true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



//  ======================================
//  Routes
//  ......................................

require('./app/routes/api')(app, express, passport);
require('./app/routes/user')(app, express, passport);
app.route('/*')
  .all(function(req, res, next) { // redirect all others to the index (HTML5 history)
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
  });



//  ======================================
//  Start Server
//  ......................................

// app.listen(port);
server.listen(port);
console.log('Magic happens on port ' + port); // shoutout to the user