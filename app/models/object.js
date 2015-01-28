// app/models/object.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ObjectSchema = new Schema({
	x: Number,
	y: Number,
	height: Number,
	width: Number,
	sprite: String,
	prompt: Boolean,
	function: String,
	actionX: Number,
	actionY: Number
});

module.exports = mongoose.model('Object', ObjectSchema);