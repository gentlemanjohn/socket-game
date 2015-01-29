module.exports = function(app, express, passport) {

  // Define a middleware function to be used for every secured routes
  var auth = function(req, res, next){
    if (!req.isAuthenticated()) 
      res.send(401);
    else
      next();
  };

  var api = express.Router(); // create our router

  api.use(function(req, res, next) { // middleware to use for all requests
    next(); // make sure we go to the next routes and don't stop here
  });


  var Bear = require('../models/bear');
  // on routes that end in /bears
  api.route('/bears')
    .post(function(req, res) { // create a bear (accessed at POST http://localhost:8080/bears)
      if(req.isAuthenticated()){
        var bear = new Bear(); // create a new instance of the Bear model
        bear.name = req.body.name; // set the bears name (comes from the request)
        bear.save(function(err) {
          if (err)
            res.send(err);
          res.redirect(api.mountpath + '/admin'); // *** If support for angular in subdirectories becomes better, api.mountpath is necessary.  Otherwise not needed. ***
        });
      } else {
        res.send(403);
      }
    })
    .get(function(req, res) { // get all the bears (accessed at GET http://localhost:8080/api/bears)
      Bear.find(function(err, bears) {
        if (err)
          res.send(err);
        res.json(bears);
      });
    });
  // on routes that end in /bears/:bear_id
  api.route('/bears/:bear_id')
    .get(function(req, res) { // get the bear with that id
      Bear.findById(req.params.bear_id, function(err, bear) {
        if (err)
          res.send(err);
        res.json(bear);
      });
    })
    .put(function(req, res) { // update the bear with this id
      if(req.isAuthenticated()){
        Bear.findById(req.params.bear_id, function(err, bear) {
          if (err)
            res.send(err);
          bear.name = req.body.name;
          bear.save(function(err) {
            if (err)
              res.send(err);
            res.redirect(api.mountpath + '/admin'); // *** If support for angular in subdirectories becomes better, api.mountpath is necessary.  Otherwise not needed. ***
          });
        });
      } else {
        res.send(403);
      }
    })
    .delete(function(req, res) { // delete the bear with this id
      if(req.isAuthenticated()){
        Bear.remove({
          _id: req.params.bear_id
        }, function(err, bear) {
          if (err)
            res.send(err);
          res.json({ message: 'Successfully deleted' });
        });
      } else {
        res.send(403);
      }
    });


  var Player = require('../models/player');
  api.route('/players')
    .post(function(req, res) {
      var player = new Player();
      player._id = req.body._id;
      player.x = req.body.x;
      player.y = req.body.y;
      player.facing = req.body.facing;
      player.avatar = req.body.avatar;
      player.save(function(err) {
        if(err)
          res.send(err);
      });
    })
    .get(function(req, res) {
      Player.find(function(err, players) {
        if(err)
          res.send(err);
        res.json(players);
      });
    });
  api.route('/players/:socket_id')
    .get(function(req, res) {
      Player.findById(req.params.socket_id, function(err, player) {
        if (err)
          res.send(err);
        res.json(player);
      });
    })
    .put(function(req, res) {
      Player.findById(req.params.socket_id, function(err, player) {
        if(err)
          res.send(err);
        player._id = req.body._id;
        player.x = req.body.x;
        player.y = req.body.y;
        player.facing = req.body.facing;
        player.avatar = req.body.avatar;
        player.save(function(err) {
          if(err)
            res.send(err);
        });
      });
    })
    .delete(function(req, res) {
      Player.remove({
        _id: req.params.socket_id
      }, function(err, player) {
        if(err)
          res.send(err);
        res.json({message:'So long, player!'});
      });
    });


  var Thing = require('../models/thing');
  api.route('/things')
    .post(function(req, res) {
      if(req.isAuthenticated()){
        var thing = new Thing();
        thing.name = req.body.name;
        thing.css = req.body.css;
        thing.x = req.body.x;
        thing.y = req.body.y;
        thing.ht = req.body.ht;
        thing.wd = req.body.wd;
        thing.actionable = req.body.actionable;
        thing.actionFunction = req.body.actionFunction;
        thing.save(function(err) {
          if(err)
            res.send(err);
        });
      } else {
        res.send(403);
      }
    })
    .get(function(req, res) { 
      Thing.find(function(err, things) {
        if (err)
          res.send(err);
        res.json(things);
      });
    });
  api.route('/things/:thing_id')
    .get(function(req, res) {
      Thing.findById(req.params.thing_id, function(err, thing) {
        if (err)
          res.send(err);
        res.json(thing);
      });
    })
    .put(function(req, res) {
      if(req.isAuthenticated()){
        Thing.findById(req.params.thing_id, function(err, thing) {
          if(err)
            res.send(err);
          thing.name = req.body.name;
          thing.css = req.body.css;
          thing.x = req.body.x;
          thing.y = req.body.y;
          thing.ht = req.body.ht;
          thing.wd = req.body.wd;
          thing.actionable = req.body.actionable;
          thing.actionFunction = req.body.actionFunction;
          thing.save(function(err) {
            if(err)
              res.send(err);
          });
        });
      } else {
        res.send(403);
      }
    })
    .delete(function(req, res) {
      if(req.isAuthenticated()){
        Thing.remove({
          _id: req.params.thing_id
        }, function(err, thing) {
          if(err)
            res.send(err);
          res.json({message:'Goodbye, thing!'});
        });
      } else {
        res.send(403);
      }
    });

  app.use('/api', api); // register our routes

}