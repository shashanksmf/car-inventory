const Database = require('./../../database.js');
const async = require('async');
var memored = require('memored');


function updateState (cb) {
  var appdetails = Database.getCollection('app');
  appdetails.findOne({ _id: 1 }, function (err, result) {

    if (enableCluster) {
      memored.store('globalAppDetails', result, function () {
        console.log('globalAppDetails stored!');
      });
    }
    else {
      globalAppDetails = result;
    }

    //
    // 	memored.read('character1', function(err, value) {
    // 		console.log('Read value:', value);
    // 	});
    //
    //
    // globalAppDetails = result;
    if (cb) cb(err, result);
  });
}


module.exports = {
  updateState
}
