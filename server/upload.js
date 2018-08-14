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
    var vehicles = [];
    var taskObj = {};
    taskObj['_id'] = new mongoose.Types.ObjectId();
    taskObj['startTime'] = Date.now();

    taskObj['file'] = file.name;

    csv
      .fromString(buffer.toString(), {
        headers: true,
        ignoreEmpty: true,
      })
      .on('data', function (data) {
        var vehicleObj = {};


        vehicleObj["_id"] = mongoose.Types.ObjectId();
        vehicleObj["taskID"] = taskObj['_id'];
        function formatData(data, vehicleObj) {
          // remove spaces in keys
          var tempObj = {};
          for (var vehicleKey in data) {
            tempObj[vehicleKey.trim()] = data[vehicleKey];
          }
          data = tempObj;

          vehicleObj["dealerName"] = data['Dealer Name'];
          vehicleObj["dealerPhone"] = data['Dealer Phone'];
          vehicleObj["dealerEmail"] = data['Dealer Email'];
          vehicleObj["dealerAddress"] = data['Dealer Address'];
          vehicleObj["dealerCity"] = data['Dealer City'];
          vehicleObj["dealerState"] = data['Dealer State'];
          vehicleObj["dealerZip"] = data['Dealer Zip'];
          vehicleObj["dealerTagline"] = data['Dealer Tagline'];
          vehicleObj["vehicleClassification"] = data['Vehicle Classification'];
          vehicleObj["vehicleCertifiedFlag"] = data['Vehicle Certified Flag'];
          vehicleObj["vehicleFactoryWarrantyFlag"] = data['Vehicle Factory Warranty Flag'];
          vehicleObj["vehicleDealerWarrantyFlag"] = data['Vehicle Dealer Warranty Flag'];
          vehicleObj["vehicleExtendedWarrantyAv1Flag"] = data['Vehicle Extended Warranty Avl. Flag'];
          vehicleObj["vehicleAutoCheckFlag"] = data['Vehicle AutoCheck Flag'];
          vehicleObj["vehicleCondition"] = data['Vehicle Condition'];
          vehicleObj["vehicleVinNumber"] = data['Vehicle Vin Number'];
          vehicleObj["vehicleStockNuber"] = data['Vehicle Stock Number'];
          vehicleObj["vehicleYear"] = data['Vehicle Year'];
          vehicleObj["vehicleMake"] = data['Vehicle Make'];
          vehicleObj["vehicleModel"] = data['Vehicle Model'];
          vehicleObj["vehicleTrim"] = data['Vehicle Trim'];
          vehicleObj["vehicleMileage"] = data['Vehicle Mileage'];
          vehicleObj["vehicleMSRP"] = data['Vehicle MSRP'];
          vehicleObj["vehicleRetailWholesaleValue"] = data['Vehicle Retail/Wholesale Value'];
          vehicleObj["vehicleInvoiceAmount"] = data['Vehicle Invoice Amount'];
          vehicleObj["vehiclePackAmount"] = data['Vehicle Pack Amount'];
          vehicleObj["vehicleTotalCost"] = data['Vehicle Total Cost'];
          vehicleObj["vehicleSellingPrice"] = data['Vehicle Selling Price'];
          vehicleObj["vehicleEngineDisplacementCI"] = data['Vehicle Engine Displacement (CI)'];
          vehicleObj["vehicleEngineCyl"] = data['Vehicle Engine #Cyl'];
          vehicleObj["vehicleEngineHP"] = data['Vehicle Engine HP'];
          vehicleObj["vehicleHPRPM"] = data['Vehicle HP RPM'];
          vehicleObj["vehicleEngineTorque"] = data['Vehicle Engine Torque'];
          vehicleObj["vehicleTorqueRPM"] = data['Vehicle Torque RPM'];
          vehicleObj["vehicleTransmissionType"] = data['Vehicle Transmission Type'];
          vehicleObj["vehicleTransmissionGears"] = data['Vehicle Transmission #Gears'];
          vehicleObj["vehicleTransmissionName"] = data['Vehicle Transmission Name'];
          vehicleObj["vehicleCityMPG"] = data['Vehicle City MPG'];
          vehicleObj["vehicleHwyMPG"] = data['Vehicle Hwy MPG'];
          vehicleObj["vehicleFuelTankCapacity"] = data['Vehicle Fuel Tank Capacity'];
          vehicleObj["vehicleExteriorColor"] = data['Vehicle Exterior Color'];
          vehicleObj["vehicleInteriorColor"] = data['Vehicle Interior Color'];
          vehicleObj["vehicleOptionalEquipment"] = data['Vehicle Optional Equipment'];
          vehicleObj["vehicleComments"] = data['Vehicle Comments'];
          vehicleObj["vehicleAdTitle"] = data['Vehicle Ad Title'];
          vehicleObj["vehicleVideoURL"] = data['Vehicle Video URL'];
          vehicleObj["vehicleImgURL"] = data['Vehicle Image URLs'];
          vehicleObj["vehicleImgURL2"] = data['Vehicle Image URL'];
          vehicleObj["vehicleImgURL3"] = data['Vehicle Image URL'];
          vehicleObj["vehicleImageURLModifiedDate"] = data['Modified Date'];
          vehicleObj["vehicleDetailLink"] = data['Vehicle Detail Link'];

        }
        formatData(data, vehicleObj)






        vehicles.push(vehicleObj);

      })
      .on('end', function () {
        Vehicle.create(vehicles, function (err, result) {
          if (err) return err;
          taskObj['success'] = vehicles.length;
          taskObj['endTime'] = Date.now();

          Task.create(taskObj, function (err, result) {
            console.log(err);

            if (err) return err;
            res.send(vehicles.length + ' vehicles have been successfully uploaded.');
          })
        });
      });
  })


};
