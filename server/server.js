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
var scheduleCtrl = require('./controllers/inbound/schedule');
var providerCtrl = require('./controllers/inbound/provider');
var ftpCtrl = require('./controllers/ftp');

var bodyParser = require('body-parser');
var TestData = require('./models/testData');

global.__baseDir = __dirname;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    scheduleCtrl.reScheduleCronJobs();
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

app.get('/ftp/getFile',ftpCtrl.downloadFile);
app.get('/ftp/uploadFile', ftpCtrl.uploadFile);
app.get('/getOrignalHeaders', providerCtrl.getOrignalHeaders);
app.post('/addProvider', providerCtrl.addProvider);
app.post('/testFTP', ftpCtrl.testFTP);
app.post('/getProviderHeaders',providerCtrl.getProviderHeaders);
app.get('/getTodaysProvidersData',providerCtrl.getTodaysProvidersData);
app.post('/inbound/scheduleJob',scheduleCtrl.scheduleJob);
app.get('/cancelCronJob/:jobId',scheduleCtrl.cancelJob);
app.get('/inbound/scheduleJob/getProviders',scheduleCtrl.getproviders);
app.get('/getProvidersScheduleData',scheduleCtrl.getProvidersScheduleData);
app.get('/getProvidersData',providerCtrl.getProvidersDetails);

global.currentProvider = {
  id : '',
  added : 0,
  updated : 0,
  error : 0
}
global.headers = {
additional_comments: "additional_comments",
autotrader_teaser: "autotrader_teaser",
body_style: "vehicleBodyStyle",
body_type: "vehicleBodyType",
book_bb: "book_bb",
book_kbb: "book_kbb",
book_nada: "book_nada",
book_other: "book_other",
carfeine_bid_price: "carfeine_bid_price",
carfeine_max_radius: "carfeine_max_radius",
carfeine_monthly_budget: "carfeine_monthly_budget",
carfeine_tracking_no: "carfeine_tracking_no",
cars_com_teaser: "cars_com_teaser",
comments: "vehicleComments",
condition: "vehicleCondition",
craigslist_teaser: "craigslist_teaser",
craigslist_title: "craigslist_title",
dealer_comments: "dealer_comments",
doors: "vehicleOfDoors",
driver_position: "driver_position",
drivetrain: "vehicleDriveTrain",
engine: "engine",
engine_aspiration_type: "engine_aspiration_type",
engine_ci: "vehicleEngineDisplacementCI",
engine_cyl: "vehicleEngine_Cyl",
engine_liter: "engine_liter",
ext_color_code: "ext_color_code",
ext_color_generic: "ext_color_generic",
ext_color_name: "vehicleExteriorColor",
ext_color_rgb: "ext_color_rgb",
feed_image_timestamp: "feed_image_timestamp",
feed_lockout: "feed_lockout",
flag_autocheck: "vehicleAutoCheckFlag",
flag_carfax: "flag_carfax",
flag_carfax_1owner: "flag_carfax_1owner",
flag_certified: "vehicleCertifiedFlag",
flag_custom: "flag_custom",
flag_dealer_warranty: "vehicleDealerWarrantyFlag",
flag_ext_warranty: "vehicleExtendedWarrantyAvlFlag",
flag_factory_warranty: "vehicleFactoryWarrantyFlag",
flag_featured: "flag_featured",
flag_green_vehicle: "flag_green_vehicle",
flag_special: "flag_special",
flag_spotlight: "flag_spotlight",
forced_induction: "forced_induction",
fuel_capacity: "vehicleFuelTankCapacity",
fuel_type: "vehicleFuelType",
fuel_units: "vehicleFuelTankCapacity",
high_output: "high_output",
hp: "vehicleEngineHP",
hp_rpm: "vehicleHPRPM",
identifier: "identifier",
images: "images",
int_color_code: "int_color_code",
int_color_name: "int_color_name",
make: "vehicleModel",
market_class: "vehicleMarketClassName",
mileage: "vehicleMileage",
model: "vehicleModel",
model_number: "model_number",
mpg_city: "vehicleCityMPG",
mpg_hwy: "vehicleHwyMPG",
needs_attention: "needs_attention",
odometer_status: "odometer_status",
options: "options",
pack_amount: "vehiclePackAmount",
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
price_invoice: "vehicleInvoiceAmount",
price_msrp: "vehicleMSRP",
stock_no: "vehicleStockNumber",
style_id: "style_id",
tags: "tags",
tq: "vehicleEngineTorque",
tq_rpm: "vehicleTorqueRPM",
transmission: "vehicleTransmissionName",
transmission_gears: "vehicleTransmissionGears",
transmission_type: "vehicleTransmissionType",
trim: "vehicleTrim",
vdp_link: "vehicleDetailLink",
vehicle_cost: "vehicleTotalCost",
video_code: "video_code",
video_provider: "video_provider",
video_type: "video_type",
video_url: "vehicleVideoURL",
vin: "vehicleVinNumber",
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



global.mappingObj = {
  body_style: "vehicleBodyStyle",
  body_type: "vehicleBodyType",
  comments: "vehicleComments",
  condition: "vehicleCondition",
  doors: "vehicleOfDoors",
  drivetrain: "vehicleDriveTrain",
  engine_ci: "vehicleEngineDisplacementCI",
  engine_cyl: "vehicleEngine_Cyl",
  ext_color_name: "vehicleExteriorColor",
  flag_autocheck: "vehicleAutoCheckFlag",
  flag_certified: "vehicleCertifiedFlag",
  flag_dealer_warranty: "vehicleDealerWarrantyFlag",
  flag_ext_warranty: "vehicleExtendedWarrantyAvlFlag",
  flag_factory_warranty: "vehicleFactoryWarrantyFlag",
  fuel_capacity: "vehicleFuelTankCapacity",
  hp: "vehicleEngineHP",
  hp_rpm: "vehicleHPRPM",
  make: "vehicleModel",
  mileage: "vehicleMileage",
  model: "vehicleModel",
  mpg_city: "vehicleCityMPG",
  mpg_hwy: "vehicleHwyMPG",
  pack_amount: "vehiclePackAmount",
  price_invoice: "vehicleInvoiceAmount",
  stock_no: "vehicleStockNumber",
  transmission: "vehicleTransmissionName",
  transmission_gears: "vehicleTransmissionGears",
  transmission_type: "vehicleTransmissionType",
  trim: "vehicleTrim",
  vehicle_cost: "vehicleTotalCost",
  video_url: "vehicleVideoURL",
  vin: "vehicleVinNumber",
}
