var mongoose = require('mongoose');

var vehicleSchema = {
  schema: {
    _id: mongoose.Schema.Types.ObjectId,
    historyId: mongoose.Schema.Types.ObjectId,
    /* providerName : {
      type : String
    },
    providerStatus : {
      type : String
    },
    ftpHost : {
      type : String
    },
    ftpUsername : {
      type : String
    },
    ftpPassword : {
      type : String
    },
    columnDelimiter : {
      type : String
    },
    exclosureCharacter : {
      type : String
    },
    escapeCharacter : {
      type : String
    },
    headerIncluded : {
      type : String
    },
    footerIncluded : {
      type : String
    },
    indentifierPosition : {
      type : String
    },
    imageDelimiter : {
      type : String
    },
    optionsCharacter : {
      type : String
    },
    escapeCharacter : {
      type : String
    },
    pullRequestURL : {
      type : String
    },
    pullRequestType : {
      type : String
    },
    preprecessRequest : {
      type : String
    },
    fileForHeader : {
      type : String
    }, */
    providerId : mongoose.Schema.Types.ObjectId,
    'DealerId': {
      type: String,
      default: ''
    },
    'dealerName': {
      type: String,
      default: ''
    },
    taskID: mongoose.Schema.Types.ObjectId,
    'dealerPhone': {
      type: String,
      default: ''
    },
    'dealerEmail': {
      type: String,
      default: ''
    },
    'dealerAddress': {
      type: String,
      default: ''
    },
    'dealerCity': {
      type: String,
      default: ''
    },
    'dealerState': {
      type: String,
      default: ''
    },
    'dealerZip': {
      type: Number,
      default: ''
    },
    'dealerTagline': {
      type: String,
      default: ''
    },
    'vehicleClassification': {
      type: String,
      default: ''
    },
    'vehicleCertifiedFlag': {
      type: String,
      default: ''
    },
    'vehicleFactoryWarrantyFlag': {
      type: String,
      default: ''
    },
    'vehicleDealerWarrantyFlag': {
      type: String,
      default: ''
    },
    'vehicleExtendedWarrantyAvlFlag': {
      type: String,
      default: ''
    },
    'vehicleAutoCheckFlag': {
      type: String,
      default: ''
    },
    'vehicleCondition': {
      type: String,
      default: ''
    },
    'vehicleVinNumber': {
      type: String,
      default: ''
    },
    'vehicleStockNumber': {
      type: String,
      default: ''
    },
    'vehicleYear': {
      type: Number,
      default: ''
    },
    'vehicleMake': {
      type: String,
      default: ''
    },
    'vehicleModel': {
      type: String,
      default: ''
    },
    'vehicleTrim': {
      type: String,
      default: ''
    },
    'vehicleMileage': {
      type: Number,
      default: ''
    },
    'vehicleMSRP': {
      type: String,
      default: ''
    },
    'vehicleRetailWholesaleValue': {
      type: Number,
      default: ''
    },
    'vehicleInvoiceAmount': {
      type: String,
      default: ''
    },
    'vehiclePackAmount': {
      type: String,
      default: ''
    },
    'vehicleTotalCost': {
      type: String,
      default: ''
    },
    'vehicleSellingPrice': {
      type: Number,
      default: ''
    },
    'vehicleSpecialPrice': {
      type: Number,
      default: ''
    },
    'vehicleStatus': {
      type: String,
      default: ''
    },
    'vehicleBodyType': {
      type: String,
      default: ''
    },
    'vehicleBodyStyle': {
      type: String,
      default: ''
    },
    'vehicleMarketClassName': {
      type: String,
      default: ''
    },
    'vehicleOfDoors': {
      type: Number,
      default: ''
    },
    'vehicleDriveTrain': {
      type: String,
      default: ''
    },
    'vehicleFuelType': {
      type: String,
      default: ''
    },
    'vehicleEngineDisplacementL': {
      // type : Decimal128
      type: String,
      default: ''
    },
    'vehicleEngineDisplacementCI': {
      // type : Decimal128
      type: String,
      default: ''
    },
    'vehicleEngine_Cyl': {
      type: Number,
      default: ''
    },
    'vehicleEngineHP': {
      type: String,
      default: ''
    },
    'vehicleHPRPM': {
      type: String,
      default: ''
    },
    'vehicleEngineTorque': {
      type: String,
      default: ''
    },
    'vehicleTorqueRPM': {
      type: String,
      default: ''
    },
    'vehicleTransmissionType': {
      type: String,
      default: ''
    },
    'vehicleTransmissionGears': {
      type: Number,
      default: ''
    },
    'vehicleTransmissionName': {
      type: String,
      default: ''
    },
    'vehicleCityMPG': {
      type: Number,
      default: ''
    },
    'vehicleHwyMPG': {
      type: Number,
      default: ''
    },
    'vehicleFuelTankCapacity': {
      type: Number,
      default: ''
    },
    'vehicleExteriorColor': {
      type: String,
      default: ''
    },
    'vehicleInteriorColor': {
      type: String,
      default: ''
    },
    'vehicleOptionalEquipment': {
      type: String,
      default: ''
    },
    'vehicleComments': {
      type: String,
      default: ''
    },
    'vehicleAdTitle': {
      type: String,
      default: ''
    },
    'vehicleVideoURL': {
      type: String,
      default: ''
    },
    'vehicleImageURLs': {
      type: String,
      default: ''
    },
    'vehicleImageURLModifiedDate': {
      type: Date,
      default: ''
    },
    'vehicleDetailLink': {
      type: String,
      default: ''
    },
    created: {
      type: Date,
      default: Date.now(),
    }
  }, options: { collection: 'vehicle' }
};

module.exports = vehicleSchema;
