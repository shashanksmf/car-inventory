var mongoose = require('mongoose');
var testDatas = {
  schema:{
    _id: mongoose.Schema.Types.ObjectId,
    headers : {
        type : Object
    },
    taskID: mongoose.Schema.Types.ObjectId


  }, options: {collection: 'testdatas'}
  };



module.exports = testDatas;
