var mongoose = require('mongoose');

var historySchema = {
    schema: {
        _id: mongoose.Schema.Types.ObjectId,
        providerId: mongoose.Schema.Types.ObjectId,
        taskId: mongoose.Schema.Types.ObjectId,
        scheduleId : mongoose.Schema.Types.ObjectId,
        providerName: {
            type: String,
        },
        providerType: {
            type : Number
        },
        lastRun: {
            type: Date,
        },
        nextRun: {
            type: Date
        },
        added: {
            type: Number,
            default: 0
        },
        error: {
            type: Number,
            default: 0
        },
        updated: {
            type: Number,
            default: 0
        },
        type: {
            type: Number
        }


    },
    options: { collection: 'history' }
}

module.exports = historySchema;