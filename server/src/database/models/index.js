
const vehicle = require('./vehicle');
const tasks = require('./tasks');
const testdatas = require('./testdatas');
const providers = require('./providers');
const schedules = require('./schedules');
const history = require('./history');
const dealer = require('./dealers');
const error = require('./errors');
const dealership = require('./dealerships');
const outboundAdded = require('./outboundAdded');

var Schema = {};
var schemaTemplate = {};
Schema.loadSchemas = function(callback) {
  // schemaTemplate['testdatas'] = mongoose.model('testData', testdatas);
  // schemaTemplate['vehicle'] = mongoose.model('vehicle', vehicle);
  // schemaTemplate['providers'] = mongoose.model('provider', providers);
  const mongoose = require('mongoose');

  var taskSchema = new mongoose.Schema(tasks.schema, tasks.options);
  var vehicleSchema = new mongoose.Schema(vehicle.schema, vehicle.options);
  var testdatasSchema = new mongoose.Schema(testdatas.schema, testdatas.options);
  var providersSchema = new mongoose.Schema(providers.schema, providers.options);
  var schedulesSchema = new mongoose.Schema(schedules.schema, schedules.options);
  var historySchema = new mongoose.Schema(history.schema, history.options);
  var dealerSchema = new mongoose.Schema(dealer.schema, dealer.options);
  var errorSchema = new mongoose.Schema(error.schema, error.options);
  var dealershipSchema = new mongoose.Schema(dealership.schema, dealership.options);
  var outboundAddedSchema = new mongoose.Schema(outboundAdded.schema, outboundAdded.options);


  schemaTemplate[tasks.options.collection] = mongoose.model('tasksModal', taskSchema);
  schemaTemplate[testdatas.options.collection] = mongoose.model('testdatasModal', testdatasSchema);
  schemaTemplate[vehicle.options.collection] = mongoose.model('vehicleModal', vehicleSchema);
  schemaTemplate[providers.options.collection] = mongoose.model('providersModal', providersSchema);
  schemaTemplate[schedules.options.collection] = mongoose.model('schedulesModal', schedulesSchema);
  schemaTemplate[history.options.collection] = mongoose.model('historyModal', historySchema);
  schemaTemplate[dealer.options.collection] = mongoose.model('dealerModal', dealerSchema);
  schemaTemplate[error.options.collection] = mongoose.model('errorModal', errorSchema);
  schemaTemplate[dealership.options.collection] = mongoose.model('dealershipModal', dealershipSchema);
  schemaTemplate[outboundAdded.options.collection] = mongoose.model('outboundModal', outboundAddedSchema);

  
  callback();
}
Schema.getcollectionSchema = function(schemaName) {
  var schema = schemaTemplate[schemaName];
  if (schema) {
    return schema;
  } else {
    return {};
  }
}

module.exports = Schema;
