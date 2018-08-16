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
var Provider = require('./models/Inbound/provider');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
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

// mongoose.connect('mongodb://admin:admin@cluster0-shard-00-00-wkiof.mongodb.net:27017,cluster0-shard-00-01-wkiof.mongodb.net:27017,cluster0-shard-00-02-wkiof.mongodb.net:27017/carinfo?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true?authMode=scram-sha1', {useNewUrlParser: false});

// mongoose.connect('mongodb://admin:admin@cluster0-shard-00-00-wkiof.mongodb.net:27017,cluster0-shard-00-01-wkiof.mongodb.net:27017,cluster0-shard-00-02-wkiof.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true?authMode=scram-sha1/carinfonew');
// mongoose.connect('mongodb://localhost:27017/carinfonew');

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
  Vehicle.find({
    taskID: taskId
  }, function(err, result) {
    res.json(result);
  });
});
// var ftpClient = require('ftp-client');
var Client = require('ftp');
var fs = require('fs');
app.get('/ftp/getFile', function(req, res) {
  var c = new Client();
  c.on('ready', function() {
    c.get('small-inventory.csv', function(err, stream) {
      if (err) throw err;
      stream.once('close', function() {
        c.end();
      });
      stream.pipe(fs.createWriteStream(
        'inboundFiles/small-inventory.csv'));
      res.send('Fine');
    });
  });
  c.connect({
    host: '127.0.0.1',
    port: 21,
    user: 'Ajayssj',
    password: 'ajayajay'
  });
});

app.get('/ftp/uploadFile', function(req, res) {
  var c = new Client();
  c.on('ready', function() {
    c.put('./inboundFiles/docs.zip', '/uploaded/docs.zip', function(err) {
      if (err) throw err;
      c.end();
      res.send('Uploaded');
    });
  });
  c.connect({
    host: '127.0.0.1',
    port: 21,
    user: 'Ajayssj',
    password: 'ajayajay'
  });
});

app.get('/getOrignalHeaders', function(req, res) {
  var orignalHeaders = Vehicle.schema.obj;
  delete orignalHeaders.taskID;
  res.json(orignalHeaders);
});

app.post('/providerData', function(req, res) {
  /*   var output = {result : false, msg : ''};
    var vehicleObj = {};
    var orignalHeaders = Vehicle.schema.obj;
    delete orignalHeaders.taskID;
    delete orignalHeaders._id;
    for(var param in req.body){
      vehicleObj[param] = req.body[param];
    }
    for(var orignal in orignalHeaders){
      vehicleObj[orignal] = req.body.headers[orignal];
    }

    Provider.create([vehicle], function(err, result) {
      console.log(err, result);
      res.json(result);
    });
   */
  var providerObj = {};
  for (var param in req.body) {
    if (param != 'headers')
      providerObj[param] = req.body[param];
  }
  var headersMapped = {};
  for (var header in req.body.headers) {
    headersMapped[header] = req.body.headers[header];
  }
  providerObj['_id'] = new mongoose.Types.ObjectId();
  providerObj.headersMapped = headersMapped;
  Provider.create(providerObj, function(err, result) {
    if (err) throw err;
    // console.log(err, result);
    res.json(result);
  });
  // res.json(providerObj);
});

app.post('/testFTP', function(req, res) {
  var c = new Client();

  c.on('ready', function() {
    c.list(function(err, list) {
      if (err) {
        res.json({
          result: 0,
          msg: err,
          class: 'danger'
        });
      }
      c.end();
      res.json({
        result: 1,
        msg: 'Connection Successfully Established !',
        class: 'success',
        list: list
      });
    });


  });
  c.on('error', function(err) {
    console.log("err", err)
    res.json({
      result: 0,
      msg: err,
      class: 'danger'
    });
  });
  c.connect({
    host: req.body.host,
    port: 21,
    user: req.body.uname,
    password: req.body.password
  });
});


app.post('/getProviderHeaders', function(req, res) {
  var c = new Client();
  console.log('Body ', req.body);
  var headers = [];
  var d;
  console.log('Dicrectoy ; ', req.body.dict + '/' + req.body.filename);
  var csv = require('fast-csv');
  c.on('ready', function() {

    c.get(req.body.dict + '/' + req.body.filename, function(err, stream) {
      if (err) {
        res.json({
          result: 0,
          msg: err,
          class: 'danger'
        });
      }
      stream.once('close', function() {
        c.end();
      });
      // stream.pipe(fs.createWriteStream('inboundFiles/' + req.body.filename));

      var csvStream = csv()
        .on("data", function(data) {
          console.log(data);
          d = data;
          for (var vehicleKey in data) {
            headers.push(vehicleKey);
          }
        })
        .on("end", function() {
          res.json(d);
        });

      stream.pipe(csvStream);
    });
  });
  c.on('error', function(err) {
    console.log("err", err)
    res.json({
      result: 0,
      msg: err,
      class: 'danger'
    });
  });
  c.connect({
    host: req.body.host,
    port: 21,
    user: req.body.uname,
    password: req.body.password
  });

  // res.json(req.body);
});
