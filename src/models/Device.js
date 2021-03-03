const mongoose = require('mongoose');
const {Schema} = mongoose;
const NoteSchema = new Schema({
    Node: {type: String, required: true},
    TDS: {type: String},
    PH: {type: String},
    EC: {type: String},
    TB: {type: String},
    date: {type: Date, default: Date.now}
},
{
    timestamps: true,
    versionKey: false
  }

);

module.exports = mongoose.model('Device', NoteSchema);