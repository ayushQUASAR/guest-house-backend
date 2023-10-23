const mongoose = require("mongoose");
const Booking = require('./booking/booking')

const schema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
    }
});

const RejectedBooking = new mongoose.model("RejectedBooking", schema);

module.exports = Booking;