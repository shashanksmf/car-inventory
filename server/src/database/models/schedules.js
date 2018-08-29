var mongoose = require('mongoose');

var scheduleSchemas = {
    schema: {
        _id: mongoose.Schema.Types.ObjectId,
        providerId: mongoose.Schema.Types.ObjectId,
        startDate: {
          type: Date
        },
        endDate: {
          type: Date
        },
        lastRun : {
          type : Date,
        },
        nextRun : {
          type : Date
        }, 
        status: {
          type: Date
        },
        interval:{
          type : Number
        },
        isStarted: {
          type: Number,
          default: 0
        },
        expression: {
          type: String
        },
        isActive : {
          type : Boolean
        },
        type : {
          type : Number
        }
    },
    options : {
        collection : 'schedule'
    }
};


module.exports = scheduleSchemas;
