var mongoose = require('mongoose');

var inboundSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  headers : {
      type : String
  },
  taskID: mongoose.Schema.Types.ObjectId
});

var Inbound = mongoose.model('testData', inboundSchema);

module.exports = Inbound;
