var mongoose = require('mongoose');

var providerSchema = {
    schema:
    {
        _id: mongoose.Schema.Types.ObjectId,
        providerName : {
            type : String
          },
          providerType : {
            type : Number
          },
          lastRun : {
              type : Date
          },
          nextRun : {
            type : Date
          },
          added : {
            type : Number,
            default : 0
          },
          updated : {
            type : Number,
            default : 0
          },
          error : {
            type : Number,
            default : 0
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
          directory : {
              type : String
          },
          filename : {
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
          },
        headersMapped: {
            'DealerId': {
                type: String
              },
              'dealerName': {
                type: String
              },
              'dealerPhone': {
                type: String
              },
              'dealerEmail': {
                type: String
              },
              'dealerAddress': {
                type: String
              },
              'dealerCity': {
                type: String
              },
              'dealerState': {
                type: String
              },
              'dealerZip': {
                type: String
              },
              'dealerTagline': {
                type: String
              },
              'vehicleClassification': {
                type: String
              },
              'vehicleCertifiedFlag': {
                type: String
              },
              'vehicleFactoryWarrantyFlag': {
                type: String
              },
              'vehicleDealerWarrantyFlag': {
                type: String
              },
              'vehicleExtendedWarrantyAvlFlag': {
                type: String
              },
              'vehicleAutoCheckFlag': {
                type: String
              },
              'vehicleCondition': {
                type: String
              },
              'vehicleVinNumber': {
                type: String
              },
              'vehicleStockNumber': {
                type: String
              },
              'vehicleYear': {
                type: String
              },
              'vehicleMake': {
                type: String
              },
              'vehicleModel': {
                type: String
              },
              'vehicleTrim': {
                type: String
              },
              'vehicleMileage': {
                type: String
              },
              'vehicleMSRP': {
                type: String
              },
              'vehicleRetailWholesaleValue': {
                type: String
              },
              'vehicleInvoiceAmount': {
                type: String
              },
              'vehiclePackAmount': {
                type: String
              },
              'vehicleTotalCost': {
                type: String
              },
              'vehicleSellingPrice': {
                type: String
              },
              'vehicleSpecialPrice': {
                type: String
              },
              'vehicleStatus': {
                type: String
              },
              'vehicleBodyType': {
                type: String
              },
              'vehicleBodyStyle': {
                type: String
              },
              'vehicleMarketClassName': {
                type: String
              },
              'vehicleOfDoors': {
                type: String
              },
              'vehicleDriveTrain': {
                type: String
              },
              'vehicleFuelType': {
                type: String
              },
              'vehicleEngineDisplacementL': {
                // type : Decimal128
                type: String
              },
              'vehicleEngineDisplacementCI': {
                // type : Decimal128
                type: String
              },
              'vehicleEngine_Cyl': {
                type: String
              },
              'vehicleEngineHP': {
                type: String
              },
              'vehicleHPRPM': {
                type: String
              },
              'vehicleEngineTorque': {
                type: String
              },
              'vehicleTorqueRPM': {
                type: String
              },
              'vehicleTransmissionType': {
                type: String
              },
              'vehicleTransmissionGears': {
                type: String
              },
              'vehicleTransmissionName': {
                type: String
              },
              'vehicleCityMPG': {
                type: String
              },
              'vehicleHwyMPG': {
                type: String
              },
              'vehicleFuelTankCapacity': {
                type: String
              },
              'vehicleExteriorColor': {
                type: String
              },
              'vehicleInteriorColor': {
                type: String
              },
              'vehicleOptionalEquipment': {
                type: String
              },
              'vehicleComments': {
                type: String
              },
              'vehicleAdTitle': {
                type: String
              },
              'vehicleVideoURL': {
                type: String
              },
              'vehicleImageURLs': {
                type: String
              },
              'vehicleImageURLModifiedDate': {
                type: Date
              },
              'vehicleDetailLink': {
                type: String
              }
        },
},
options: {collection: 'provider'},
};

module.exports = providerSchema;
