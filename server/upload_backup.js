var csv = require('fast-csv');
var mongoose = require('mongoose');
var Vehicle = require('./models/vehicle');
var Task = require('./models/task');
var readChunk = require('read-chunk');
var fileType = require('file-type');

var formidable = require('formidable');

exports.post = function (req, res) {

  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, async function (err, fields, files) {
    const file = files.file;
    let buffer = null;
    var totalSize = 0;

    totalSize = 2147483647;
    buffer = await readChunk.sync(file.path, 0, totalSize);
    type = fileType(buffer);
    console.log('req.files.file');
    var vehicles = [];
    var taskObj = {};
    taskObj['_id'] = new mongoose.Types.ObjectId();
    taskObj['startTime'] = Date.now();
    
    csv
      .fromString(buffer.toString(), {
        headers: true,
        ignoreEmpty: true,
      })
      .on('data', function (data) {
        var vehicleObj = {};
        // for(var vehicleKey in data) {
        //   vehicleObj['taskID'] = taskObj['_id'];
          
        //   vehicleObj[vehicleKey.trim()] = data[vehicleKey];
        // }
        for(var vehicleKey in data) {
          vehicleObj['taskID'] = taskObj['_id'];
          vehicleObj['_id'] = new mongoose.Types.ObjectId();
          var key = vehicleKey.trim();
          var keyArray = key.split(' ');
          keyArray[0] = keyArray[0].toLowerCase();
          key = keyArray.join('');
          vehicleObj[key] = data[vehicleKey];
        }
        vehicles.push(vehicleObj);

      })
      .on('end', function () {
        Vehicle.create(vehicles, function (err, result) {
          if(err) throw err;
          taskObj['success'] =  vehicles.length;
          taskObj['endTime'] = Date.now();

          Task.create(taskObj,function(err,result){
            console.log(err);
            if(err) throw err;
            res.send(vehicles.length + ' vehicles have been successfully uploaded.');
          })
        });
      });
  })


};
