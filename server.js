// Module Dependencies
var express = require('express'),
  app = express(),
  http = require('http'),
  path = require('path'),
  fs = require("fs"),
  _ = require('lodash'),
  dir  = require('node-dir');

var conf = _.extend({
    dir : path.join(__dirname, 'app'),
    port : 8080
  },conf);

var relative_dirs = function(curr) {
  return path.relative(conf.dir, curr);
}

var excluded_folders = function(val) {
  return !val.match("bower_components");
}

module.exports = function(conf){

  app.use(require('connect-livereload')());
  app.set("views", conf.dir)

  app.use(express.static('app'));
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
  });
  app.use('/js', express.static('dist'));

  app.listen(conf.port);
  console.log("Server started in http://localhost:" + conf.port);
}
