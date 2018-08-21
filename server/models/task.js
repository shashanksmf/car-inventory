var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
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

});

var Task = mongoose.model('task', taskSchema);

module.exports = Task;