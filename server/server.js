'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
require('./db.js');
var app = module.exports = loopback();
// var app = require('express')();
// var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
// var server = require('http').Server(app);
var Task = require('./models/task');
var Vehicle = require('./models/vehicle');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

// app.use(fileUpload());

// server.listen(80);

mongoose.connect('mongodb://admin:admin@cluster0-shard-00-00-wkiof.mongodb.net:27017,cluster0-shard-00-01-wkiof.mongodb.net:27017,cluster0-shard-00-02-wkiof.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true?authMode=scram-sha1/carinfo');
// mongoose.connect('mongodb://localhost:27017/carinfo');

// app.get('/', function (req, res) {
//  res.sendFile(__dirname + '/index.html');
// });

var template = require('./template.js');
app.get('/template', template.get);

var upload = require('./upload.js');
app.post('/uploadcsv', upload.post);

app.post('/vehicles', function(req, res) {
  // console.log(req);

  // // console.log(req);
  // res.json(req.body);
  var vehicle = req.body;
  console.log('vehicle-->', vehicle);
  vehicle['_id'] = new mongoose.Types.ObjectId();

  Vehicle.create([vehicle], function(err, result) {
    console.log(err, result);
    res.json(result);
  });
});
app.get('/tasks', function(req, res) {
  Task.find(function(err, result) {
    res.json(result);
  });
});

app.get('/task/:taskId', function(req, res) {
  const taskId = req.params.taskId;
  Vehicle.find({taskID: taskId}, function(err, result) {
    res.json(result);
  });
});
