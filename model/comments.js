// model/comments.js
'use strict';
// import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create new instance of the mongoose.Schema
var CommentsSchema = new Schema({
  author: String,
  text: String
});

// export module to use in server.js
module.exports = mongoose.model('Comment', CommentsSchema);