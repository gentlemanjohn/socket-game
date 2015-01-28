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
        res.json({message:'So long!'});
      });
    });

  app.use('/api', api); // register our routes

}