var csv = require('fast-csv');
var mongoose = require('mongoose');

var Database = require("./../../database");

var Vehicle = Database.getcollectionSchema('vehicle');
var Task = Database.getcollectionSchema('task');
var TestData = Database.getcollectionSchema('testData');
var History = Database.getcollectionSchema('history');

var readChunk = require('read-chunk');
var fileType = require('file-type');
var formidable = require('formidable');
var mapping = require('./../../utils/mapping');
var moment = require('moment');
module.exports = {
    uploadCSV : function (req, res) {

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
            // taskObj['_id'] = new mongoose.Types.ObjectId();
            // taskObj['startTime'] = Date.now();
            taskObj['lastRun'] = new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss')).getTime()
            var headers = {};
            var isFirstLine = true;
            // taskObj['file'] = file.name;
            taskObj['filename'] = file.name;


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
                        if (err) 
                            res.send('Error While Uploding , Try Again !');
                     /*    taskObj['success'] = vehicles.length;
                        taskObj['endTime'] = Date.now();

                        Task.create(taskObj, function (err, result) {
                            console.log(err);
                            var testObj = {};
                            testObj["_id"] = mongoose.Types.ObjectId();
                            testObj['headers'] = headers;
                            testObj["taskID"] = taskObj['_id'];

                            TestData.create(testObj, function (err, result) {
                                if (err) throw err;
                            })
                            if (err) return err;
                            res.send(vehicles.length + ' vehicles have been successfully uploaded.');
                        }) */

                        let addedIds = [];
                        result.forEach(vehicle => {
                            addedIds.push(vehicle._id);
                        });

                        taskObj['_id'] = new mongoose.Types.ObjectId();
                        taskObj['nextRun'] = new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss')).getTime();
                        taskObj['type'] = 3;
                        taskObj['error'] = 0;
                        taskObj['added'] = vehicles.length;
                        // taskObj['providerType'] = 1;
                        taskObj['addedIds'] = addedIds;
                        History.create(taskObj,function(err,result){
                            if(err)
                                res.send('Error While Uploding , Try Again !');
                            var testObj = {};
                            testObj["_id"] = mongoose.Types.ObjectId();
                            testObj['headers'] = headers;
                            testObj["taskID"] = taskObj['_id'];

                            TestData.create(testObj, function (err, result) {
                                if (err) throw err;
                            })
                            res.send(vehicles.length + ' vehicles have been successfully uploaded.');
                    
                        });
                    });
                });
        })
    },
    addVehicle : function(req, res) {
        var vehicle = req.body;
        vehicle['_id'] = new mongoose.Types.ObjectId();

        Vehicle.create(vehicle, function(err, result) {
            if(err)           
                res.json({result : false, msg : 'Error While Inserting Vehicle Data!'});
            else
                res.json({result : true, msg : 'Vehicle Data Added Successfully!'});  
        });
      }
};
