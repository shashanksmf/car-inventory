'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');


var Database = require('./src/database');
var app = module.exports = loopback();
// var app = require('express')();
// var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
// var server = require('http').Server(app);
// var Task = require('./models/task');
// var Vehicle = require('./models/vehicle');
// var Provider = require('./models/inbound/provider');
var scheduleCtrl = require('./controllers/inbound/schedule');
// var TestData = require('./models/testData');
// const mapping = require('./utils/mapping');
const path = require('path');

global.__baseDir = __dirname;


app.start = function() {
  // start the web server
  global.app = app;
  var router = require('./src/router.js');
  router.bindRoutes();
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
  if (require.main === module) {
    Database.loadDb(function () {
      app.start();
    })
  }
});

global.headers = {
  'DealerId': 'DealerId',
  'dealerName':'dealerName',
  'dealerPhone': 'dealerPhone',
  'dealerEmail': 'dealerEmail',
  'dealerAddress': 'dealerAddress',
  'dealerCity': 'dealerCity',
  'dealerState': 'dealerState',
  'dealerZip': 'dealerZip',
  'dealerTagline':'dealerTagline',
  'vehicleClassification':'vehicleClassification',
  'vehicleCertifiedFlag':'vehicleCertifiedFlag',
  'vehicleFactoryWarrantyFlag': 'vehicleFactoryWarrantyFlag',
  'vehicleDealerWarrantyFlag':'vehicleDealerWarrantyFlag',
  'vehicleExtendedWarrantyAvlFlag':'vehicleExtendedWarrantyAvlFlag',
  'vehicleAutoCheckFlag':'vehicleAutoCheckFlag',
  'vehicleCondition':'vehicleCondition',
  'vehicleCondition':'vehicleCondition',
  'vehicleVinNumber':'vehicleVinNumber',
  'vehicleStockNumber':'vehicleStockNumber',
  'vehicleYear':'vehicleYear',
  'vehicleMake':  'vehicleMake',
  'vehicleModel':'vehicleModel',
  'vehicleTrim':'vehicleTrim',
  'vehicleMileage':'vehicleMileage',
  'vehicleMSRP':'vehicleMSRP',
  'vehicleRetailWholesaleValue':'vehicleRetailWholesaleValue',
  'vehicleInvoiceAmount':'vehicleInvoiceAmount',
  'vehiclePackAmount':'vehiclePackAmount',
  'vehicleTotalCost':'vehicleTotalCost',
  'vehicleSellingPrice':'vehicleSellingPrice',
  'vehicleSpecialPrice':'vehicleSpecialPrice',
  'vehicleStatus':'vehicleStatus',
  'vehicleBodyType':'vehicleBodyType',
  'vehicleBodyStyle':'vehicleBodyStyle',
  'vehicleMarketClassName':'vehicleMarketClassName',
  'vehicleOfDoors':'vehicleOfDoors',
  'vehicleDriveTrain':'vehicleDriveTrain',
  'vehicleFuelType':'vehicleFuelType',
  'vehicleEngineDisplacementL':'vehicleEngineDisplacementL',
  'vehicleEngineDisplacementCI':'vehicleEngineDisplacementCI',
  'vehicleEngine_Cyl':'vehicleEngine_Cyl',
  'vehicleEngineHP':'vehicleEngineHP',
  'vehicleHPRPM':'vehicleHPRPM',
  'vehicleEngineTorque':'vehicleEngineTorque',
  'vehicleTorqueRPM':'vehicleTorqueRPM',
  'vehicleTransmissionType':'vehicleTransmissionType',
  'vehicleTransmissionGears':'vehicleTransmissionGears',
  'vehicleTransmissionName':'vehicleTransmissionName',
  'vehicleCityMPG':'vehicleCityMPG',
  'vehicleHwyMPG':'vehicleHwyMPG',
  'vehicleFuelTankCapacity':'vehicleFuelTankCapacity',
  'vehicleExteriorColor':'vehicleExteriorColor',
  'vehicleInteriorColor':'vehicleInteriorColor',
  'vehicleOptionalEquipment':'vehicleOptionalEquipment',
  'vehicleComments':'vehicleComments',
  'vehicleAdTitle':'vehicleAdTitle',
  'vehicleVideoURL':'vehicleVideoURL',
  'vehicleImageURLs':'vehicleImageURLs',
  'vehicleImageURLModifiedDate':'vehicleImageURLModifiedDate',
  'vehicleDetailLink':'vehicleDetailLink'
}


