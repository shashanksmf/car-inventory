var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  providerId : mongoose.Schema.Types.ObjectId,
  taskId : mongoose.Schema.Types.ObjectId,
  providerName: {
    type : String,
  },
  lastRun : {
      type : Date,
  },
  nextRun : {
    type : Date
  }, 
  added : {
      type : Number,
      default : 0
  },
  error : {
      type : Number,
      default : 0
  },
  updated : {
      type : Number,
      default : 0
  },
  type : {
      type : Number
  }

});

var History = mongoose.model('history', historySchema);

module.exports = History;