// app/models/player.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PlayerSchema = new Schema({
	_id: String,
	x: Number,
	y: Number,
	moving: Boolean,
	facing: String,
	avatar: String
});

module.exports = mongoose.model('Player', PlayerSchema);