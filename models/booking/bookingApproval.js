const mongoose =require("mongoose");
const Booking = require("./booking")


const schema = new mongoose.Schema({
booking: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref:'Booking',
},
status: {
   type: String,
   required: true,
   enum: ["accept", "reject"]
},

// roomAllotted: {
//    type: [Number],
//    default: [-1,-1],
// },
// guestHouseAllotted:{
//    type:  [Number],
//    default: [-1,-1]
// }
});



const BookingApproval = new mongoose.model("BookingApproval", schema);

module.exports = BookingApproval;