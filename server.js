// server.js
'use strict'

// import our dependencies...
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('./model/comments');

// create our instances
var app = express();
var router = express.Router();

// set port to either a predetermined port number or 3001
var port = process.env.API_PORT || 3001;

// db config
var mongoDB = 'your standard mongodb uri' || "mongodb://localhost:/comment-app";
mongoose.connect(mongoDB, { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// To prevent errors from Cross Origin Resource Sharing, set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  // remove cacheing to get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// set the GET route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

// adding the /comments route to /api router
router.route('/comments')
  // retrieve all comments from the database
  .get(function(req, res) {
    // looks at Comment Schema
    Comment.find(function(err, comments) {
      if (err)
        res.send(err);
      // responds with a json object of our database comments.
      res.json(comments)
    });
  })
  // post new comment to the database
  .post(function(req, res) {
    var comment = new Comment();
    // body parser lets us use the req.body
    comment.author = req.body.author;
    comment.text = req.body.text;

    comment.save(function(err) {
    if (err)
      res.send(err);
    res.json({ message: 'Comment successfully added!' });
  });
});

// handling PUT and DELETE request with given comment_id
router.route('/comments/:comment_id')
// PUT update comment based on the ID passed to the route
  .put(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err)
        res.send(err);
      // setting the new author and text to whatever was changed. 
      // If nothing was changed, it will not alter the field.
      (req.body.author) ? comment.author = req.body.author : null;
      (req.body.text) ? comment.text = req.body.text : null;
      // save comment to the database
      comment.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Comment has been updated' });
      });
    });
  })
 // DELETE method for removing a comment from database
 .delete(function(req, res) {
    // selects the comment by comment_id, and then removes it
    Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
      if (err)
        res.send(err);
      res.json({ message: 'Comment has been deleted' })
    })
  });

// Use our router configuration when we call /api
app.use('/api', router);

// starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
