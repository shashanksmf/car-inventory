
var Schema = {};

Schema.loadDb = function(callback) {

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

Schema.getcollectionSchema = function(schemaName) {
    

}

module.exports = Schema;
