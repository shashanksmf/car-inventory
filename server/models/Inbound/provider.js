var mongoose = require('mongoose');

var providerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    providerName : {
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
      },
    headersMapped: {
        'DealerId': {
            type: String,
        },
        'dealerName': {
            type: String,
        },
        // taskID: mongoose.Schema.Types.ObjectId,
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
            type: String,
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
            type: String,
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
            type: String,
        },
        'vehicleMSRP': {
            type: String,
        },
        'vehicleRetail/WholesaleValue': {
            type: String,
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
            type: String,
        },
        'vehicleSpecialPrice': {
            type: String,
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
            type: String,
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
            type: String,
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
            type: String,
        },
        'vehicleTransmissionName': {
            type: String,
        },
        'vehicleCityMPG': {
            type: String,
        },
        'vehicleHwyMPG': {
            type: String,
        },
        'vehicleFuelTankCapacity': {
            type: String,
        },
        'vehicleCityMPG': {
            type: String,
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
            type: String,
        },
        'vehicleDetailLink': {
            type: String,
        },
    }
    // headers : { 
    //     additional_comments: {
    //         type: String
    //     },
    //     autotrader_teaser: {
    //         type: String
    //     },
    //     body_style: {
    //         type: String
    //     },
    //     body_type: {
    //         type: String
    //     },
    //     book_bb: {
    //         type: String
    //     },
    //     book_kbb: {
    //         type: String
    //     },
    //     book_nada: {
    //         type: String
    //     },
    //     book_other: {
    //         type: String
    //     },
    //     carfeine_bid_price: {
    //         type: String
    //     },
    //     carfeine_max_radius: {
    //         type: String
    //     },
    //     carfeine_monthly_budget: {
    //         type: String
    //     },
    //     carfeine_tracking_no: {
    //         type: String
    //     },
    //     cars_com_teaser: {
    //         type: String
    //     },
    //     comments: {
    //         type: String
    //     },
    //     condition: {
    //         type: String
    //     },
    //     craigslist_teaser: {
    //         type: String
    //     },
    //     craigslist_title: {
    //         type: String
    //     },
    //     dealer_comments: {
    //         type: String
    //     },
    //     doors: {
    //         type: String
    //     },
    //     driver_position: {
    //         type: String
    //     },
    //     drivetrain: {
    //         type: String
    //     },
    //     engine: {
    //         type: String
    //     },
    //     engine_aspiration_type: {
    //         type: String
    //     },
    //     engine_ci: {
    //         type: String
    //     },
    //     engine_cyl: {
    //         type: String
    //     },
    //     engine_liter: {
    //         type: String
    //     },
    //     ext_color_code: {
    //         type: String
    //     },
    //     ext_color_generic: {
    //         type: String
    //     },
    //     ext_color_name: {
    //         type: String
    //     },
    //     ext_color_rgb: {
    //         type: String
    //     },
    //     feed_image_timestamp: {
    //         type: String
    //     },
    //     feed_lockout: {
    //         type: String
    //     },
    //     flag_autocheck: {
    //         type: String
    //     },
    //     flag_carfax: {
    //         type: String
    //     },
    //     flag_carfax_1owner: {
    //         type: String
    //     },
    //     flag_certified: {
    //         type: String
    //     },
    //     flag_custom: {
    //         type: String
    //     },
    //     flag_dealer_warranty: {
    //         type: String
    //     },
    //     flag_ext_warranty: {
    //         type: String
    //     },
    //     flag_factory_warranty: {
    //         type: String
    //     },
    //     flag_featured: {
    //         type: String
    //     },
    //     flag_green_vehicle: {
    //         type: String
    //     },
    //     flag_special: {
    //         type: String
    //     },
    //     flag_spotlight: {
    //         type: String
    //     },
    //     forced_induction: {
    //         type: String
    //     },
    //     fuel_capacity: {
    //         type: String
    //     },
    //     fuel_type: {
    //         type: String
    //     },
    //     fuel_units: {
    //         type: String
    //     },
    //     high_output: {
    //         type: String
    //     },
    //     hp: {
    //         type: String
    //     },
    //     hp_rpm: {
    //         type: String
    //     },
    //     identifier: {
    //         type: String
    //     },
    //     images: {
    //         type: String
    //     },
    //     int_color_code: {
    //         type: String
    //     },
    //     int_color_name: {
    //         type: String
    //     },
    //     make: {
    //         type: String
    //     },
    //     market_class: {
    //         type: String
    //     },
    //     mileage: {
    //         type: String
    //     },
    //     model: {
    //         type: String
    //     },
    //     model_number: {
    //         type: String
    //     },
    //     mpg_city: {
    //         type: String
    //     },
    //     mpg_hwy: {
    //         type: String
    //     },
    //     needs_attention: {
    //         type: String
    //     },
    //     odometer_status: {
    //         type: String
    //     },
    //     options: {
    //         type: String
    //     },
    //     pack_amount: {
    //         type: String
    //     },
    //     passenger_capacity: {
    //         type: String
    //     },
    //     price_1: {
    //         type: String
    //     },
    //     price_1_hide: {
    //         type: String
    //     },
    //     price_1_label: {
    //         type: String
    //     },
    //     price_2: {
    //         type: String
    //     },
    //     price_2_hide: {
    //         type: String
    //     },
    //     price_2_label: {
    //         type: String
    //     },
    //     price_3: {
    //         type: String
    //     },
    //     price_3_hide: {
    //         type: String
    //     },
    //     price_3_hide: {
    //         type: String
    //     },
    //     price_4: {
    //         type: String
    //     },
    //     price_4_hide: {
    //         type: String
    //     },
    //     price_4_label: {
    //         type: String
    //     },
    //     price_destination: {
    //         type: String
    //     },
    //     price_invoice: {
    //         type: String
    //     },
    //     price_msrp: {
    //         type: String
    //     },
    //     stock_no: {
    //         type: String
    //     },
    //     style_id: {
    //         type: String
    //     },
    //     tags: {
    //         type: String
    //     },
    //     tq: {
    //         type: String
    //     },
    //     tq_rpm: {
    //         type: String
    //     },
    //     transmission: {
    //         type: String
    //     },
    //     transmission_gears: {
    //         type: String
    //     },
    //     transmission_type: {
    //         type: String
    //     },
    //     trim: {
    //         type: String
    //     },
    //     vdp_link: {
    //         type: String
    //     },
    //     vehicle_cost: {
    //         type: String
    //     },
    //     video_code: {
    //         type: String
    //     },
    //     video_provider: {
    //         type: String
    //     },
    //     video_type: {
    //         type: String
    //     },
    //     video_url: {
    //         type: String
    //     },
    //     vin: {
    //         type: String
    //     },
    //     website_teaser: {
    //         type: String
    //     },
    //     website_title: {
    //         type: String
    //     },
    //     year: {
    //         type: String
    //     },
    //     option_01: {
    //         type: String
    //     },
    //     option_02: {
    //         type: String
    //     },
    //     option_03: {
    //         type: String
    //     },
    //     option_04: {
    //         type: String
    //     },
    //     option_05: {
    //         type: String
    //     },
    //     option_06: {
    //         type: String
    //     },
    //     option_07: {
    //         type: String
    //     },
    //     option_08: {
    //         type: String
    //     },
    //     option_09: {
    //         type: String
    //     },
    //     option_10: {
    //         type: String
    //     },
    //     option_11: {
    //         type: String
    //     },
    //     option_12: {
    //         type: String
    //     },
    //     option_13: {
    //         type: String
    //     },
    //     option_14: {
    //         type: String
    //     },
    //     option_15: {
    //         type: String
    //     },
    //     option_16: {
    //         type: String
    //     },
    //     option_17: {
    //         type: String
    //     },
    //     option_18: {
    //         type: String
    //     },
    //     option_19: {
    //         type: String
    //     },
    //     option_20: {
    //         type: String
    //     },
    //     option_21: {
    //         type: String
    //     },
    //     option_22: {
    //         type: String
    //     },
    //     option_23: {
    //         type: String
    //     },
    //     option_24: {
    //         type: String
    //     },
    //     option_25: {
    //         type: String
    //     },
    //     option_26: {
    //         type: String
    //     },
    //     option_27: {
    //         type: String
    //     },
    //     option_28: {
    //         type: String
    //     },
    //     option_29: {
    //         type: String
    //     },
    //     option_30: {
    //         type: String
    //     },
    //     image_01: {
    //         type: String
    //     },
    //     image_02: {
    //         type: String
    //     },
    //     image_03: {
    //         type: String
    //     },
    //     image_04: {
    //         type: String
    //     },
    //     image_05: {
    //         type: String
    //     },
    //     image_06: {
    //         type: String
    //     },
    //     image_07: {
    //         type: String
    //     },
    //     image_08: {
    //         type: String
    //     },
    //     image_09: {
    //         type: String
    //     },
    //     image_10: {
    //         type: String
    //     },
    //     image_11: {
    //         type: String
    //     },
    //     image_12: {
    //         type: String
    //     },
    //     image_13: {
    //         type: String
    //     },
    //     image_14: {
    //         type: String
    //     },
    //     image_15: {
    //         type: String
    //     },
    //     image_16: {
    //         type: String
    //     },
    //     image_17: {
    //         type: String
    //     },
    //     image_18: {
    //         type: String
    //     },
    //     image_19: {
    //         type: String
    //     },
    //     image_20: {
    //         type: String
    //     },
    //     image_21: {
    //         type: String
    //     },
    //     image_22: {
    //         type: String
    //     },
    //     image_23: {
    //         type: String
    //     },
    //     image_24: {
    //         type: String
    //     },
    //     image_25: {
    //         type: String
    //     },
    //     image_26: {
    //         type: String
    //     },
    //     image_27: {
    //         type: String
    //     },
    //     image_28: {
    //         type: String
    //     },
    //     image_29: {
    //         type: String
    //     },
    //     image_30: {
    //         type: String
    //     }
    // },

});

var Provider = mongoose.model('provider', providerSchema);

module.exports = Provider;
