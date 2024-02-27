const mongoose =require("mongoose");
const Booking = require("./booking")


const schema = new mongoose.Schema({
booking: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref:'Booking',
unique: true,
},
status: {
   type: String,
   required: true,
   enum: ["accept", "reject", "autoReject"],
},

roomsAllotted: {
   type: [Number],
   default: []
},
guestHouseAllotted:{
   type:  Number
},
paymentDeadline: {
   type: Number
},
rejectionReason: String
}, { timestamps: true });



const BookingApproval = new mongoose.model("BookingApproval", schema);

module.exports = BookingApproval;