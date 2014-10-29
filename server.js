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
  var playerAvatars = ['char1.png','char2.png','char3.png','char4.png','char5.png','char6.png','char7.png'];

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
    io.sockets.emit('create player', socket.id, 0, 0, 'right', playerAvatars[randomAvatar]);
    console.log('Player ' + socket.id + ' has connected and been added to the database');
    io.sockets.emit('get players');

    socket.on('disconnect', function(){
      Player.remove({_id: socket.id}, function(err, player) {
        console.log('Player ' + socket.id + ' has disconnected and been deleted from the database');
      });
      io.sockets.emit('get players');
    });

    socket.on('change player', function(direction) {
      Player.findById(socket.id, function(err, player) {
        if(err)
          res.send(err);
        if(player.facing === direction) {
          switch(direction) {
            case 'up':
              if(player.y >= 32)
                player.y -= 32;
              break;
            case 'right':
              if(player.x <= 736)
                player.x += 32;
              break;
            case 'down':
              if(player.y <= 416)
                player.y += 32
              break;
            case 'left':
              if(player.x >= 32)
                player.x -= 32
              break;
          }
          io.to(socket.id).emit('message', 'you moved');
        } else {
          player.facing = direction;
        }
        player.save(function(err) {
          if(err)
            res.send(err);
        });
      });
      io.sockets.emit('get players');
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