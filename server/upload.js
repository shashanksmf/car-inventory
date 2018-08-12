var csv = require('fast-csv');
var mongoose = require('mongoose');
var Vehicle = require('./vehicle');

exports.post = function(req, res) {
  console.log('req.files.file');
  var {files = '', file = ''} = req;
  console.log('files', files, 'file', file);
  if (!req.files)
      return res.status(400).send('No files were uploaded.');

  var vehicleFile = req.files.file;

  var vehicles = [];

  csv
        .fromString(vehicleFile.data.toString(), {
          headers: true,
          ignoreEmpty: true,
        })
        .on('data', function(data) {
          data['_id'] = new mongoose.Types.ObjectId();

          vehicles.push(data);
        })
        .on('end', function() {
          Vehicle.create(vehicles, function(err, documents) {
              if (err) throw err;
            });

          res.send(vehicles.length + ' vehicles have been successfully uploaded.');
        });
};
