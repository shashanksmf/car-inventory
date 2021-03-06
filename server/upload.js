var csv = require('fast-csv');
var mongoose = require('mongoose');
var Vehicle = require('./models/vehicle');
var Task = require('./models/task');
var TestData = require('./models/testData');
var readChunk = require('read-chunk');
var fileType = require('file-type');
var formidable = require('formidable');
var mapping = require('./utils/mapping');

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
    var vehicles = [];
    var taskObj = {};
    taskObj['_id'] = new mongoose.Types.ObjectId();
    taskObj['startTime'] = Date.now();
    var headers = {};
    var isFirstLine = true;
    taskObj['file'] = file.name;

    csv
      .fromString(buffer.toString(), {
        headers: true,
        ignoreEmpty: true,
      })
      .on('data', function (data) {
        var vehicleObj;
        if (isFirstLine) {
          isFirstLine = false;
          headers = mapping.getHeaderFields(data);
        }
        vehicleObj = mapping.csvToDbFields(data);
        vehicleObj["_id"] = mongoose.Types.ObjectId();
        vehicleObj["taskID"] = taskObj['_id'];
        vehicles.push(vehicleObj);

      })
      .on('end', function () {
        Vehicle.create(vehicles, function (err, result) {
          if (err) return err;
          taskObj['success'] = vehicles.length;
          taskObj['endTime'] = Date.now();

          Task.create(taskObj, function (err, result) {
            console.log(err);
            var testObj = {};
            testObj["_id"] = mongoose.Types.ObjectId();
            testObj['headers'] = headers;
            testObj["taskID"] = taskObj['_id'];

            TestData.create(testObj, function(err, result) {
              if(err) throw err;
            })
            if (err) return err;
            res.send(vehicles.length + ' vehicles have been successfully uploaded.');
          })
        });
      });
  })


};
