const mongoose =require("mongoose");
const Booking = require("./booking/booking")


const schema = new mongoose.Schema({
booking: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref:'Booking',
},
paymentStatus: {
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    enum: ['Pending', "Completed"],
},
isApproved: {
    type: Boolean,
    required: true, 
    default :false,  
},

});

const BookingApproval = new mongoose.model("BookingApproval", schema);

module.exports = BookingApproval;