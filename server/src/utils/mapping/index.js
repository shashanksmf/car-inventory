
var mapping = {}

mapping.removeKeySpaces = function (csvData) {
  var tempObj = {};
  for (var csvColumn in csvData) {
    tempObj[csvColumn.trim()] = csvData[csvColumn];
    // headers.push(csvColumn);
  }
  return tempObj;

}
mapping.csvToDbFields = function(csvData) { // NOTE: Obj, Obj
  // remove spaces in keys
  csvData = mapping.removeKeySpaces(csvData);
  var dbData = {};

  dbData["dealerName"] = csvData['Dealer Name'];
  dbData["dealerPhone"] = csvData['Dealer Phone'];
  dbData["dealerEmail"] = csvData['Dealer Email'];
  dbData["dealerAddress"] = csvData['Dealer Address'];
  dbData["dealerCity"] = csvData['Dealer City'];
  dbData["dealerState"] = csvData['Dealer State'];
  dbData["dealerZip"] = csvData['Dealer Zip'];
  dbData["dealerTagline"] = csvData['Dealer Tagline'];
  dbData["vehicleClassification"] = csvData['Vehicle Classification'];
  dbData["vehicleCertifiedFlag"] = csvData['Vehicle Certified Flag'];
  dbData["vehicleFactoryWarrantyFlag"] = csvData['Vehicle Factory Warranty Flag'];
  dbData["vehicleDealerWarrantyFlag"] = csvData['Vehicle Dealer Warranty Flag'];
  dbData["vehicleExtendedWarrantyAv1Flag"] = csvData['Vehicle Extended Warranty Avl. Flag'];
  dbData["vehicleAutoCheckFlag"] = csvData['Vehicle AutoCheck Flag'];
  dbData["vehicleCondition"] = csvData['Vehicle Condition'];
  dbData["vehicleVinNumber"] = csvData['Vehicle Vin Number'];
  dbData["vehicleStockNuber"] = csvData['Vehicle Stock Number'];
  dbData["vehicleYear"] = csvData['Vehicle Year'];
  dbData["vehicleMake"] = csvData['Vehicle Make'];
  dbData["vehicleModel"] = csvData['Vehicle Model'];
  dbData["vehicleTrim"] = csvData['Vehicle Trim'];
  dbData["vehicleMileage"] = csvData['Vehicle Mileage'];
  dbData["vehicleMSRP"] = csvData['Vehicle MSRP'];
  dbData["vehicleRetailWholesaleValue"] = csvData['Vehicle Retail/Wholesale Value'];
  dbData["vehicleInvoiceAmount"] = csvData['Vehicle Invoice Amount'];
  dbData["vehiclePackAmount"] = csvData['Vehicle Pack Amount'];
  dbData["vehicleTotalCost"] = csvData['Vehicle Total Cost'];
  dbData["vehicleSellingPrice"] = csvData['Vehicle Selling Price'];
  dbData["vehicleEngineDisplacementCI"] = csvData['Vehicle Engine Displacement (CI)'];
  dbData["vehicleEngineCyl"] = csvData['Vehicle Engine #Cyl'];
  dbData["vehicleEngineHP"] = csvData['Vehicle Engine HP'];
  dbData["vehicleHPRPM"] = csvData['Vehicle HP RPM'];
  dbData["vehicleEngineTorque"] = csvData['Vehicle Engine Torque'];
  dbData["vehicleTorqueRPM"] = csvData['Vehicle Torque RPM'];
  dbData["vehicleTransmissionType"] = csvData['Vehicle Transmission Type'];
  dbData["vehicleTransmissionGears"] = csvData['Vehicle Transmission #Gears'];
  dbData["vehicleTransmissionName"] = csvData['Vehicle Transmission Name'];
  dbData["vehicleCityMPG"] = csvData['Vehicle City MPG'];

  dbData["vehicleOfDoors"] = csvData['Vehicle # of Doors'];
  dbData["vehicleEngineDisplacementL"] = csvData['Vehicle Engine Displacement (L)'];


  dbData["vehicleHwyMPG"] = csvData['Vehicle Hwy MPG'];
  dbData["vehicleFuelTankCapacity"] = csvData['Vehicle Fuel Tank Capacity'];
  dbData["vehicleExteriorColor"] = csvData['Vehicle Exterior Color'];
  dbData["vehicleInteriorColor"] = csvData['Vehicle Interior Color'];
  dbData["vehicleOptionalEquipment"] = csvData['Vehicle Optional Equipment'];
  dbData["vehicleComments"] = csvData['Vehicle Comments'];
  dbData["vehicleAdTitle"] = csvData['Vehicle Ad Title'];
  dbData["vehicleVideoURL"] = csvData['Vehicle Video URL'];
  dbData["vehicleImgURL"] = csvData['Vehicle Image URLs'];
  dbData["vehicleImgURL2"] = csvData['Vehicle Image URL'];
  dbData["vehicleImgURL3"] = csvData['Vehicle Image URL'];
  dbData["vehicleImageURLModifiedDate"] = csvData['Modified Date'];
  dbData["vehicleDetailLink"] = csvData['Vehicle Detail Link'];


  return dbData;
}
mapping.getHeaderFields = function (csvData) {
  csvData = mapping.removeKeySpaces(csvData);

  var result = {
    csvHeaders: Object.keys(csvData),
    mappedFields: Object.keys(mapping.csvToDbFields(csvData))
  }
  return result;
}

module.exports = mapping;
