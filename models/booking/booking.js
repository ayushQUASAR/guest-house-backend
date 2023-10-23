const mongoose  = require("mongoose");
const Room = require("../room")

const bookingSchema = new mongoose.Schema({
    email :{
     type:String,
     required: true,
     unique: true,
    }, 
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    reason: {
    type: String,
     required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
       },
       
       payment: {
        type: Number,
        required: true,
       }
});

const Booking = new mongoose.model("Booking", bookingSchema);
module.exports = Booking;