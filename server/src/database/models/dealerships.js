var mongoose = require('mongoose');

var dealershipSchema = {
    schema: {
        _id: mongoose.Schema.Types.ObjectId,
        dealershipName : {
            type : String
        },
        displayName : {
            type : String
        },
        status : {
            type : Boolean
        },
        dealershipType : {
            type : Number
        },
        inventoryPackage : {
            type : String
        },
        dealerOrg : {
            type : String
        },
        serviceType : {
            type : String
        },
        primaryPhone : {
            type : String
        },
        firstName : {
            type : String
        },
        lastName : {
            type : String
        },
        email : {
            type : String
        },
        phoneNumber : {
            type : String
        },
        department : {
            type : String
        },
        employeePosition : {
            type : String
        },
        address1 : {
             type : String
        },
        address2 : {
            type : String
        },
        city : {
            type : String
        },
        state : {
            type : String
        },
        postalCode : {
            type : Number
        }
    },
    options: { collection: 'dealership' }
}

module.exports = dealershipSchema;