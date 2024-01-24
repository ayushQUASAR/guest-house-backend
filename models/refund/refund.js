const mongoose = require("mongoose");
const Room = require("../room")

const refundSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Booking',
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    IFSC: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const Refund = new mongoose.model("Refund", refundSchema);
module.exports = Refund;