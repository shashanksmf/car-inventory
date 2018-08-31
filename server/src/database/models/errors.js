var mongoose = require('mongoose');

var errorSchema = {
    schema: {
        _id: mongoose.Schema.Types.ObjectId,
        historyId: mongoose.Schema.Types.ObjectId,
        error: {
            type : String
        },
        directory : {
            type : String
        },
        rowNo : {
            type : Number 
        }
    },
    options: { collection: 'error' }
}
module.exports = errorSchema;