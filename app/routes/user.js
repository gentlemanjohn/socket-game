module.exports = function(app, express, passport) {

  // Define a middleware function to be used for every secured routes
  var auth = function(req, res, next){
    if (!req.isAuthenticated()) 
      res.send(401);
    else
      next();
  };

  var admin = express.Router();

  // route to test if the user is logged in or not
  admin.route('/loggedin')
    .get(function(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
    });

  // route to log in
  admin.route('/login')
    .post(passport.authenticate('local'), function(req, res) {
      res.send(req.user);
    });

  // route to log out
  admin.route('/logout')
    .post(function(req, res){
      req.logOut();
      res.status(200).end();
    });

  app.use('/', admin); // register our routes

}