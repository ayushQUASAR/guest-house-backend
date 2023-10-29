const mongoose =require("mongoose");
const Booking = require("./booking")


const schema = new mongoose.Schema({
booking: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref:'Booking',
},
paymentStatus: {
    type:mongoose.Schema.Types.ObjectId,
    enum: ['Pending', "Completed"],
    default: false
},
status: {
   type: String,
   required: true,
   enum: ["accept", "reject"]
},

});

const BookingApproval = new mongoose.model("BookingApproval", schema);

module.exports = BookingApproval;