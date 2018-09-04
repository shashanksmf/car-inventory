var mongoose = require('mongoose');

var DbSchema = require('./models');

var env = require('./../configs/environment.json');
// mongoose.connect(
//   'mongodb://admin:admin@cluster0-shard-00-00-wkiof.mongodb.net:27017,cluster0-shard-00-01-wkiof.mongodb.net:27017,cluster0-shard-00-02-wkiof.mongodb.net:27017/carinfo?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true?authMode=scram-sha1', {
//     useNewUrlParser: false
//   });

var Database = {};

Database.loadDb = function(callback) {
  DbSchema.loadSchemas(function () {
    var InboundSchedule = require('./../controllers/inbound/schedule/helpers');
    var outboundSchedule = require('./../controllers/outbound/schedule/helpers');
    InboundSchedule.reScheduleCronJobs();
    outboundSchedule.reScheduleCronJobs();
  });

  if (env.APP == "LOCAL") {
    mongoose.connect(env.DB_URL);
  } else {
    mongoose.connect(env.DB_URL_LIVE, {useNewUrlParser: false} );
  }

  mongoose.connection.on('connected', function() {
    callback({success: true, data: null});
    console.log('Mongoose default connection open to ');
  });

  mongoose.connection.on('error', function(err) {
    callback({success: false, data: err});
    console.log('Mongoose default connection error: ' + err);
  });

  mongoose.connection.on('disconnected', function() {
    callback({success: false, data: null});
    console.log('Mongoose default connection disconnected');
  });


}

Database.getcollectionSchema = function(schemaName) {
  return DbSchema.getcollectionSchema(schemaName);
}

module.exports = Database;
