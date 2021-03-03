const mongoose = require('mongoose');
const {Schema} = mongoose;

const ReservationSchema = new Schema({

    input_date: {type: Date, default:''},
    ouput_date: {type: Date, default:''},
    status: {type: String, required: true},
    park_name: {type: String, required: true},
    user: {type: String, required: true},
    park_id: {type: String, required: true}
}
,
{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Reservation', ReservationSchema)