var mongoose = require('mongoose');

var testSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  headers : {
      type : Object
  },
  taskID: mongoose.Schema.Types.ObjectId


});

var Test = mongoose.model('testData', testSchema);

module.exports = Test;
