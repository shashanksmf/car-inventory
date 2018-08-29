var mongoose = require('mongoose');

var vehicleSchema = {
  schema: {
    _id: mongoose.Schema.Types.ObjectId,
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
    },
    additional_comments: {
      type: String,
      default: ''
    },
    autotrader_teaser: {
      type: String,
      default: ''
    },
    book_bb: {
      type: String,
      default: ''
    },
    book_kbb: {
      type: String,
      default: ''
    },
    book_nada: {
      type: String,
      default: ''
    },
    book_other: {
      type: String,
      default: ''
    },
    carfeine_bid_price: {
      type: String,
      default: ''
    },
    carfeine_max_radius: {
      type: String,
      default: ''
    },
    carfeine_monthly_budget: {
      type: String,
      default: ''
    },
    carfeine_tracking_no: {
      type: String,
      default: ''
    },
    cars_com_teaser: {
      type: String,
      default: ''
    },
    craigslist_teaser: {
      type: String,
      default: ''
    },
    craigslist_title: {
      type: String,
      default: ''
    },
    dealer_comments: {
      type: String,
      default: ''
    },
    driver_position: {
      type: String,
      default: ''
    },
    engine: {
      type: String,
      default: ''
    },
    engine_aspiration_type: {
      type: String,
    },
    engine_liter: {
      type: String,
      default: ''
    },
    ext_color_code: {
      type: String,
      default: ''
    },
    ext_color_generic: {
      type: String,
      default: ''
    },
    ext_color_rgb: {
      type: String,
      default: ''
    },
    feed_image_timestamp: {
      type: String,
      default: ''
    },
    feed_lockout: {
      type: String,
      default: ''
    },

    flag_carfax: {
      type: String,
      default: ''
    },
    flag_carfax_1owner: {
      type: String,
      default: ''
    },
    flag_custom: {
      type: String,
      default: ''
    },
    flag_featured: {
      type: String,
      default: ''
    },
    flag_green_vehicle: {
      type: String,
      default: ''
    },
    flag_special: {
      type: String,
      default: ''
    },
    flag_spotlight: {
      type: String,
      default: ''
    },
    forced_induction: {
      type: String,
      default: ''
    },
    fuel_type: {
      type: String,
      default: ''
    },
    fuel_units: {
      type: String,
      default: ''
    },
    high_output: {
      type: String,
      default: ''
    },
    identifier: {
      type: String,
      default: ''
    },
    images: {
      type: String,
      default: ''
    },
    int_color_code: {
      type: String,
      default: ''
    },
    int_color_name: {
      type: String,
      default: ''
    },
    market_class: {
      type: String,
      default: ''
    },
    model_number: {
      type: String,
      default: ''
    },
    needs_attention: {
      type: String,
      default: ''
    },
    odometer_status: {
      type: String,
      default: ''
    },
    options: {
      type: String,
      default: ''
    },
    price_1: {
      type: String,
      default: ''
    },
    passenger_capacity: {
      type: String,
      default: ''
    },
    price_1_hide: {
      type: String,
      default: ''
    },
    price_1_label: {
      type: String,
      default: ''
    },
    price_2: {
      type: String,
      default: ''
    },
    price_2_hide: {
      type: String,
      default: ''
    },
    price_2_label: {
      type: String,
      default: ''
    },
    price_3: {
      type: String,
      default: ''
    },
    price_3_hide: {
      type: String,
      default: ''
    },
    price_3_label: {
      type: String,
      default: ''
    },
    price_4: {
      type: String,
      default: ''
    },
    price_4_hide: {
      type: String,
      default: ''
    },
    price_4_label: {
      type: String,
      default: ''
    },
    price_destination: {
      type: String,
      default: ''
    },
    price_msrp: {
      type: String,
      default: ''
    },
    style_id: {
      type: String,
      default: ''
    },
    tags: {
      type: String,
      default: ''
    },
    tq: {
      type: String,
      default: ''
    },
    tq_rpm: {
      type: String,
      default: ''
    },
    vdp_link: {
      type: String,
      default: ''
    },
    video_code: {
      type: String,
      default: ''
    },
    video_provider: {
      type: String,
      default: ''
    },
    video_type: {
      type: String,
      default: ''
    },
    website_teaser: {
      type: String,
      default: ''
    },
    website_title: {
      type: String,
      default: ''
    },
    year: {
      type: String,
      default: ''
    },
    option_01: {
      type: String,
      default: ''
    },
    option_02: {
      type: String,
      default: ''
    },
    option_03: {
      type: String,
      default: ''
    },
    option_04: {
      type: String,
      default: ''
    },
    option_05: {
      type: String,
      default: ''
    },
    option_06: {
      type: String,
      default: ''
    },
    option_07: {
      type: String,
      default: ''
    },
    option_08: {
      type: String,
      default: ''
    },
    option_09: {
      type: String,
      default: ''
    },
    option_10: {
      type: String,
      default: ''
    },
    option_11: {
      type: String,
      default: ''
    },
    option_12: {
      type: String,
      default: ''
    },
    option_13: {
      type: String,
      default: ''
    },
    option_14: {
      type: String,
      default: ''
    },
    option_15: {
      type: String,
      default: ''
    },
    option_16: {
      type: String,
      default: ''
    },
    option_17: {
      type: String,
      default: ''
    },
    option_18: {
      type: String,
      default: ''
    },
    option_19: {
      type: String,
      default: ''
    },
    option_20: {
      type: String,
      default: ''
    },
    option_21: {
      type: String,
      default: ''
    },
    option_22: {
      type: String,
      default: ''
    },
    option_23: {
      type: String,
      default: ''
    },
    option_24: {
      type: String,
      default: ''
    },
    option_25: {
      type: String,
      default: ''
    },
    option_26: {
      type: String,
      default: ''
    },
    option_27: {
      type: String,
      default: ''
    },
    option_28: {
      type: String,
      default: ''
    },
    option_29: {
      type: String,
      default: ''
    },
    option_30: {
      type: String,
      default: ''
    },
    image_01: {
      type: String,
      default: ''
    },
    image_02: {
      type: String,
      default: ''
    },
    image_03: {
      type: String,
      default: ''
    },
    image_04: {
      type: String,
      default: ''
    },
    image_05: {
      type: String,
      default: ''
    },
    image_06: {
      type: String,
      default: ''
    },
    image_07: {
      type: String,
      default: ''
    },
    image_08: {
      type: String,
      default: ''
    },
    image_09: {
      type: String,
      default: ''
    },
    image_10: {
      type: String,
      default: ''
    },
    image_11: {
      type: String,
      default: ''
    },
    image_12: {
      type: String,
      default: ''
    },
    image_13: {
      type: String,
      default: ''
    },
    image_14: {
      type: String,
      default: ''
    },
    image_15: {
      type: String,
      default: ''
    },
    image_16: {
      type: String,
      default: ''
    },
    image_17: {
      type: String,
      default: ''
    },
    image_18: {
      type: String,
      default: ''
    },
    image_19: {
      type: String,
      default: ''
    },
    image_20: {
      type: String,
      default: ''
    },
    image_21: {
      type: String,
      default: ''
    },
    image_22: {
      type: String,
      default: ''
    },
    image_23: {
      type: String,
      default: ''
    },
    image_24: {
      type: String,
      default: ''
    },
    image_25: {
      type: String,
      default: ''
    },
    image_26: {
      type: String,
      default: ''
    },
    image_27: {
      type: String,
      default: ''
    },
    image_28: {
      type: String,
      default: ''
    },
    image_29: {
      type: String,
      default: ''
    },
    image_30: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
    additional_comments: {
      type: String,
      default: ''
    },
  }, options: { collection: 'vehicle' }
};

module.exports = vehicleSchema;
