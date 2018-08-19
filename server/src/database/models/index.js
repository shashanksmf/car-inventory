
const vehicle = require('./vehicle');
const tasks = require('./tasks');
const testdatas = require('./testdatas');
const providers = require('./providers');

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

  schemaTemplate['tasks'] = mongoose.model('tasksModal', taskSchema);
  schemaTemplate['testdatas'] = mongoose.model('testdatasModal', testdatasSchema);
  schemaTemplate['vehicle'] = mongoose.model('vehicleModal', vehicleSchema);
  schemaTemplate['providers'] = mongoose.model('providersModal', providersSchema);
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
