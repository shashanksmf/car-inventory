var mongoose = require('mongoose');

var dealerSchema = {
    schema: {
        _id: mongoose.Schema.Types.ObjectId,
        providerId: mongoose.Schema.Types.ObjectId,
        dealerId: {
            type : String
        },
    },
    options: { collection: 'dealer' }
}

module.exports = dealerSchema;