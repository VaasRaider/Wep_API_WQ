const mongoose = require('mongoose');
const {Schema} = mongoose;
const VehicleSchema = new Schema({
    placas: {type: String, required: true},
    description: {type: String, required: true},
    user: {type: String}
},
{
    timestamps: true,
    versionKey: false
  }

);

module.exports = mongoose.model('Vehicle', VehicleSchema);