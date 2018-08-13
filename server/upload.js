var csv = require('fast-csv');
var mongoose = require('mongoose');
var Vehicle = require('./vehicle');
var readChunk = require('read-chunk');
var fileType = require('file-type');

var formidable = require('formidable');

exports.post = function (req, res) {

  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, async function (err, fields, files) {
    const file = files.file;
    let buffer = null,
      type = null,
      filename = '';
    var totalSize = 0;

    totalSize = 2147483647;
    buffer = await readChunk.sync(file.path, 0, totalSize);
    type = fileType(buffer);
    // console.log("buffer.toString()", buffer.toString())
    console.log('req.files.file');

    var vehicles = [];

    csv
      .fromString(buffer.toString(), {
        headers: true,
        ignoreEmpty: true,
      })
      .on('data', function (data) {
        data['_id'] = new mongoose.Types.ObjectId();
        data['name'] = {};
        data.name['firstName'] = data["Dealer Name"];
        vehicles.push(data);
        const vechileObj = new Vehicle(data);
        vechileObj.save(data).then((err, result) => {
          console.log("err", err, result)
        })


      })
      .on('end', function () {
        console.log("vevhiles.length", vehicles.length)

        res.send(vehicles.length + ' vehicles have been successfully uploaded.');
      });
  })


};
