var mongoose = require('mongoose');

var cronScheduleSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  providerId: mongoose.Schema.Types.ObjectId,
  startDate: {
    type: Date
  },
  status: {
    type: Date
  },
  isStarted: {
    type: Number
  },
  expression: {
    type: String
  },
  isActive : {
    type : Boolean
  }

});

var CronSchedule = mongoose.model('cronSchedule', cronScheduleSchema);

module.exports = CronSchedule;
