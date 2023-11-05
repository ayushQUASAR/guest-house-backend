const mongoose = require("mongoose");
const Booking = require('./booking');

const schema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Booking',
    }
}, { timestamps: true });

const RejectedBooking = new mongoose.model("RejectedBooking", schema);

module.exports = RejectedBooking;
