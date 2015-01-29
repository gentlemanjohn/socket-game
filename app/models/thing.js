// app/models/object.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ObjectSchema = new Schema({
	name: String,
	css: String,
	x: Number,
	y: Number,
	ht: Number,
	wd: Number,
	actionable: Boolean,
	actionFunction: String
});

module.exports = mongoose.model('Object', ObjectSchema);