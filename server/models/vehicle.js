var mongoose = require('mongoose');

var vehicleSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  'DealerId': {
    type: String,
  },
  'dealerName': {
    type: String,
  },
  taskID: mongoose.Schema.Types.ObjectId,
  'dealerPhone': {
    type: String,
  },
  'dealerEmail': {
    type: String,
  },
  'dealerAddress': {
    type: String,
  },
  'dealerCity': {
    type: String,
  },
  'dealerState': {
    type: String,
  },
  'dealerZip': {
    type: Number,
  },
  'dealerTagline': {
    type: String,
  },
  'vehicleClassification': {
    type: String,
  },
  'vehicleCertifiedFlag': {
    type: String,
  },
  'vehicleFactoryWarrantyFlag': {
    type: String,
  },
  'vehicleDealerWarrantyFlag': {
    type: String,
  },
  'vehicleExtendedWarrantyAvl.Flag': {
    type: String,
  },
  'vehicleAutoCheckFlag': {
    type: String,
  },
  'vehicleCondition': {
    type: String,
  },
  'vehicleVinNumber': {
    type: String,
  },
  'vehicleStockNumber': {
    type: String,
  },
  'vehicleYear': {
    type: Number,
  },
  'vehicleMake': {
    type: String,
  },
  'vehicleModel': {
    type: String,
  },
  'vehicleTrim': {
    type: String,
  },
  'vehicleMileage': {
    type: Number,
  },
  'vehicleMSRP': {
    type: String,
  },
  'vehicleRetail/WholesaleValue': {
    type: Number,
  },
  'vehicleInvoiceAmount': {
    type: String,
  },
  'vehiclePackAmount': {
    type: String,
  },
  'vehicleTotalCost': {
    type: String,
  },
  'vehicleSellingPrice': {
    type: Number,
  },
  'vehicleSpecialPrice': {
    type: Number,
  },
  'vehicleStatus': {
    type: String,
  },
  'vehicleBodyType': {
    type: String,
  },
  'vehicleBodyStyle': {
    type: String,
  },
  'vehicleMarketClassName': {
    type: String,
  },
  'vehicle#ofDoors': {
    type: Number,
  },
  'vehicleDriveTrain': {
    type: String,
  },
  'vehicleFuelType': {
    type: String,
  },
  'vehicleEngineDisplacement(L)': {
    // type : Decimal128
    type: String,
  },
  'vehicleEngineDisplacement(CI)': {
    // type : Decimal128
    type: String,
  },
  'vehicleEngine#Cyl': {
    type: Number,
  },
  'vehicleEngineHP': {
    type: String,
  },
  'vehicleHPRPM': {
    type: String,
  },
  'vehicleEngineTorque': {
    type: String,
  },
  'vehicleTorqueRPM': {
    type: String,
  },
  'vehicleTransmissionType': {
    type: String,
  },
  'vehicleTransmission#Gears': {
    type: Number,
  },
  'vehicleTransmissionName': {
    type: String,
  },
  'vehicleCityMPG': {
    type: Number,
  },
  'vehicleHwyMPG': {
    type: Number,
  },
  'vehicleFuelTankCapacity': {
    type: Number,
  },
  'vehicleCityMPG': {
    type: Number,
  },
  'vehicleExteriorColor': {
    type: String,
  },
  'vehicleInteriorColor': {
    type: String,
  },
  'vehicleOptionalEquipment': {
    type: String,
  },
  'vehicleComments': {
    type: String,
  },
  'vehicleAdTitle': {
    type: String,
  },
  'vehicleVideoURL': {
    type: String,
  },
  'vehicleImageURLs': {
    type: String,
  },
  'vehicleImageURLModifiedDate': {
    type: Date,
  },
  'vehicleDetailLink': {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

var Vehicle = mongoose.model('vehicle', vehicleSchema);

module.exports = Vehicle;
