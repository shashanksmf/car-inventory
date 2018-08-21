var mongoose = require('mongoose');

var DbSchema = require('./models');
// mongoose.connect(
//   'mongodb://admin:admin@cluster0-shard-00-00-wkiof.mongodb.net:27017,cluster0-shard-00-01-wkiof.mongodb.net:27017,cluster0-shard-00-02-wkiof.mongodb.net:27017/carinfo?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true?authMode=scram-sha1', {
//     useNewUrlParser: false
//   });

var Database = {};

Database.loadDb = function(callback) {

    mongoose.connect('mongodb://localhost:27017/carinfo');

    mongoose.connection.on('connected', function() {
        callback();
      console.log('Mongoose default connection open to ');
    });
    
    mongoose.connection.on('error', function(err) {
        callback();
        console.log('Mongoose default connection error: ' + err);
    });
    
    mongoose.connection.on('disconnected', function() {
        // callback();
        console.log('Mongoose default connection disconnected');
    });
    
}

Database.getcollectionSchema = function(schemaName) {
    

}

module.exports = Database;
