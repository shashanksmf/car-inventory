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
// var Provider = require('./models/inbound/provider');
var scheduleCtrl = require('./controllers/inbound/schedule');
var bodyParser = require('body-parser');
var TestData = require('./models/testData');
const mapping = require('./utils/mapping');
const path = require('path');

global.__baseDir = __dirname;

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


app.post('/getProviderHeaders',function(req,res){
  var c = new Client();
  console.log('Body ' , req.body);
  var directoryPath = req.body.dict ? req.body.dict : '';
  var headers = [];
   var d;
  console.log('Dicrectoy ; ' , directoryPath + '/' + req.body.filename);
  var taskObj = {};
  var vehicleList = [];
  taskObj['_id'] = new mongoose.Types.ObjectId();
  taskObj['startTime'] = Date.now();
  var isFirstLine = true;
  var csv = require('fast-csv');
  c.on('ready', function() {

    c.get(path.join(directoryPath, '/', req.body.filename), function(err, stream) {
      if (err){
        console.log("err ", err );
        return res.json({result : 0,msg : err, class : 'danger'});
      }
      stream.once('close', function() { c.end(); });
      // stream.pipe(fs.createWriteStream('inboundFiles/' + req.body.filename));

      var csvStream = csv()
      .on("data", function(data){
        if (isFirstLine) {
          for (var i = 0; i < data.length; i++) {
            data[i] = data[i].trim()
          }
          isFirstLine = false;
          headers = data;
          console.log("headers ", headers );
        } else {
          console.log("data ", data );
          var vehicleObj = {};
          for (var i = 0; i < headers.length; i++) {
            var key = headers[i];
            var vehicleVal = data[i];
            vehicleObj[key] = vehicleVal;
          }
          vehicleObj = mapping.csvToDbFields(vehicleObj);
          vehicleObj["_id"] = mongoose.Types.ObjectId();
          vehicleObj["taskID"] = taskObj['_id'];
          vehicleList.push(vehicleObj);
        }

      })
      .on("end", function(){
        // res.json(d);
        console.log("vehicleList", vehicleList);
        Vehicle.create(vehicleList, function (err, result) {
          if (err) return err;
          taskObj['success'] = vehicleList.length;
          taskObj['endTime'] = Date.now();

          Task.create(taskObj, function (err, result) {
            var testObj = {};
            testObj["_id"] = mongoose.Types.ObjectId();
            testObj['headers'] = headers;
            testObj["taskID"] = taskObj['_id'];

            TestData.create(testObj, function(err, result) {
              if(err) throw err;
            })
            if (err) return err;
            res.send(vehicleList.length + ' vehicles have been successfully uploaded.');
          })
        });
      });

      stream.pipe(csvStream);
    });
  });
  c.on('error',function(err){
    console.log("err",err)
    res.json({result : 0,msg : err, class : 'danger'});
  });
  c.connect({
        host: req.body.host,
        port: 21,
        user: req.body.uname,
        password: req.body.password
    });

  // res.json(req.body);
});

var schedule = require('node-schedule');
var jobs = [];

app.get('/startCron',function(req,res){

  let startTime = new Date(Date.now() + 5000);
  let endTime = new Date(startTime.getTime() + 23000000);
  var msg = 'Hello AJay';
  jobs['myjob'] = schedule.scheduleJob({ start: startTime, rule: '*/1 * * * * *' }, function(message){
    console.log(message);
  }.bind(null,msg));
  res.send('Cron Job Started!');
});

app.get('/stopCron',function(req,res){
  jobs['myjob'].cancel();
    res.send('Cron Job Canceled');
});
app.post('/inbound/scheduleJob',scheduleCtrl.scheduleJob);
app.get('/inbound/scheduleJob/getProviders',scheduleCtrl.getproviders);




global.headers = {
additional_comments: "additional_comments",
autotrader_teaser: "autotrader_teaser",
// body_style: "vehicleBodyStyle",
// body_type: "vehicleBodyType",
book_bb: "book_bb",
book_kbb: "book_kbb",
book_nada: "book_nada",
book_other: "book_other",
carfeine_bid_price: "carfeine_bid_price",
carfeine_max_radius: "carfeine_max_radius",
carfeine_monthly_budget: "carfeine_monthly_budget",
carfeine_tracking_no: "carfeine_tracking_no",
cars_com_teaser: "cars_com_teaser",
// comments: "vehicleComments",
// condition: "vehicleCondition",
craigslist_teaser: "craigslist_teaser",
craigslist_title: "craigslist_title",
dealer_comments: "dealer_comments",
// doors: "vehicleOfDoors",
driver_position: "driver_position",
// drivetrain: "vehicleDriveTrain",
engine: "engine",
engine_aspiration_type: "engine_aspiration_type",
// engine_ci: "vehicleEngineDisplacementCI",
// engine_cyl: "vehicleEngine_Cyl",
engine_liter: "engine_liter",
ext_color_code: "ext_color_code",
ext_color_generic: "ext_color_generic",
// ext_color_name: "vehicleExteriorColor",
ext_color_rgb: "ext_color_rgb",
feed_image_timestamp: "feed_image_timestamp",
feed_lockout: "feed_lockout",
// flag_autocheck: "vehicleAutoCheckFlag",
flag_carfax: "flag_carfax",
flag_carfax_1owner: "flag_carfax_1owner",
// flag_certified: "vehicleCertifiedFlag",
flag_custom: "flag_custom",
// flag_dealer_warranty: "vehicleDealerWarrantyFlag",
// flag_ext_warranty: "vehicleExtendedWarrantyAvlFlag",
// flag_factory_warranty: "vehicleFactoryWarrantyFlag",
flag_featured: "flag_featured",
flag_green_vehicle: "flag_green_vehicle",
flag_special: "flag_special",
flag_spotlight: "flag_spotlight",
forced_induction: "forced_induction",
// fuel_capacity: "vehicleFuelTankCapacity",
fuel_type: "vehicleFuelType",
fuel_units: "vehicleFuelTankCapacity",
high_output: "high_output",
// hp: "vehicleEngineHP",
// hp_rpm: "vehicleHPRPM",
identifier: "identifier",
images: "images",
int_color_code: "int_color_code",
int_color_name: "int_color_name",
// make: "vehicleModel",
market_class: "vehicleMarketClassName",
// mileage: "vehicleMileage",
// model: "vehicleModel",
model_number: "model_number",
// mpg_city: "vehicleCityMPG",
// mpg_hwy: "vehicleHwyMPG",
needs_attention: "needs_attention",
odometer_status: "odometer_status",
options: "options",
// pack_amount: "vehiclePackAmount",
passenger_capacity: "passenger_capacity",
price_1: "price_1",
price_1_hide: "price_1_hide",
price_1_label: "price_1_label",
price_2: "price_2",
price_2_hide: "price_2_hide",
price_2_label: "price_2_label",
price_3: "price_3",
price_3_hide: "price_3_hide",
price_3_label: "price_3_label",
price_4: "price_4",
price_4_hide: "price_4_hide",
price_4_label: "price_4_label",
price_destination: "price_destination",
// price_invoice: "vehicleInvoiceAmount",
price_msrp: "vehicleMSRP",
// stock_no: "vehicleStockNumber",
style_id: "style_id",
tags: "tags",
tq: "vehicleEngineTorque",
tq_rpm: "vehicleTorqueRPM",
// transmission: "vehicleTransmissionName",
// transmission_gears: "vehicleTransmissionGears",
// transmission_type: "vehicleTransmissionType",
// trim: "vehicleTrim",
vdp_link: "vehicleDetailLink",
// vehicle_cost: "vehicleTotalCost",
video_code: "video_code",
video_provider: "video_provider",
video_type: "video_type",
// video_url: "vehicleVideoURL",
// vin: "vehicleVinNumber",
website_teaser: "website_teaser",
website_title: "website_title",
year: "year",
option_01: "option_01",
option_02: "option_02",
option_03: "option_03",
option_04: "option_04",
option_05: "option_05",
option_06: "option_06",
option_07: "option_07",
option_08: "option_08",
option_09: "option_09",
option_10: "option_10",
option_11: "option_11",
option_12: "option_12",
option_13: "option_13",
option_14: "option_14",
option_15: "option_15",
option_16: "option_16",
option_17: "option_17",
option_18: "option_18",
option_19: "option_19",
option_20: "option_20",
option_21: "option_21",
option_22: "option_22",
option_23: "option_23",
option_24: "option_24",
option_25: "option_25",
option_26: "option_26",
option_27: "option_27",
option_28: "option_28",
option_29: "option_29",
option_30: "option_30",
image_01: "vehicleImageURLs",
image_02: "vehicleImageURLModifiedDate",
image_03: "image_03",
image_04: "image_04",
image_05: "image_05",
image_06: "image_06",
image_07: "image_07",
image_08: "image_08",
image_09: "image_09",
image_10: "image_10",
image_11: "image_11",
image_12: "image_12",
image_13: "image_13",
image_14: "image_14",
image_15: "image_15",
image_16: "image_16",
image_17: "image_17",
image_18: "image_18",
image_19: "image_19",
image_20: "image_20",
image_21: "image_21",
image_22: "image_22",
image_23: "image_23",
image_24: "image_24",
image_25: "image_25",
image_26: "image_26",
image_27: "image_27",
image_28: "image_28",
image_29: "image_29",
image_30: "image_30",
}
