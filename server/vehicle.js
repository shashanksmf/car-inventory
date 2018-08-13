var mongoose = require('mongoose');

var vehicleSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
      firstName: {
          type: String,
        },
      lastName: {type: String},
    },
  created: {
      type: Date,
      default: Date.now(),
    },
});

var Vehicle = mongoose.model('vehicle', vehicleSchema);

module.exports = Vehicle;
