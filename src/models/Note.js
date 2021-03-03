const mongoose = require('mongoose');
const {Schema} = mongoose;
const NoteSchema = new Schema({
    title: {type: String, required: true},
    topic: {type: String, required: true},
    description: {type: String, required: true},
    user: {type: String}
},
{
    timestamps: true,
    versionKey: false
  }

);

module.exports = mongoose.model('Note', NoteSchema);