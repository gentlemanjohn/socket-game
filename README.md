socketIO-game
=============
Add a database.js file under the 'config' folder with:

module.exports = {
  "uri": "mongodb://dbuser:dbpassword@127.0.0.1:27017/dbname"
}

Also, don't forget to change config/app.js user and password to something a little more secure :)
