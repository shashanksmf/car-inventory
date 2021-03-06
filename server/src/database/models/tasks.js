var mongoose = require('mongoose');

var testSchema = {
  schema: {
    _id: mongoose.Schema.Types.ObjectId,
    file : {
        type : String
    },
    startTime : {
        type : Date,
    },
    endTime : {
      type : Date
    },
    success : {
        type : Number
    },
    error : {
        type : Number,
        default : 0
    },
    total : {
        type : Number
    }

  },
  options: {collection: 'task'},
}
// var taskSchema = new mongoose.Schema();


module.exports = testSchema;
