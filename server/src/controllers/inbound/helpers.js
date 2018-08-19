const Database = require('./../../database');


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

        if (cb) cb(err, result);
  });
}


module.exports = {
  updateState
}
